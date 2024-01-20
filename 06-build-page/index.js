const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const charset = 'utf8';
const projectDistFolder = 'project-dist';
const assetsFolder = 'assets';
const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const distFolderPath = path.join(__dirname, projectDistFolder);
const indexFilePath = path.join(distFolderPath, 'index.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const distStylePath = path.join(__dirname, projectDistFolder, 'style.css');
const assetsSourcePath = path.join(__dirname, assetsFolder);
const assetsDistPath = path.join(__dirname, projectDistFolder, assetsFolder);

let templateCont;
const components = [];

async function getComponents() {
  templateCont = await fsPromises.readFile(templateFilePath, charset);
  const componentRegEx = /{{(.*?)}}/g;
  let component;
  while ((component = componentRegEx.exec(templateCont))) {
    components.push(component[1]);
  }
}

async function replaceTagsWithContent(components) {
  for (const componentName of components) {
    const componentFilePath = path.join(
      componentsFolderPath,
      `${componentName}.html`,
    );
    const componentCont = await fsPromises.readFile(componentFilePath, charset);
    templateCont = templateCont.replace(`{{${componentName}}}`, componentCont);
  }
}

async function saveModifiedTemplate() {
  await fsPromises.rm(distFolderPath, { force: true, recursive: true });
  await fsPromises.mkdir(distFolderPath, { recursive: true });
  await fsPromises.writeFile(indexFilePath, templateCont, charset);
}

async function createStyleFile() {
  const files = await fsPromises.readdir(stylesFolderPath, {
    withFileTypes: true,
  });

  const writeStream = fs.createWriteStream(distStylePath, {
    encoding: charset,
  });

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(stylesFolderPath, file.name);
      const fileExtension = path.extname(filePath);

      if (fileExtension === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(writeStream);
      }
    }
  });
}

async function copyAssets(sourcePath, distPath) {
  await fsPromises.mkdir(distPath, {
    recursive: true,
  });
  const files = await fsPromises.readdir(sourcePath);
  files.forEach(async (fileName) => {
    const fileSourcePath = path.join(sourcePath, fileName);
    const fileDistPath = path.join(distPath, fileName);
    const fileStats = await fsPromises.stat(fileSourcePath);
    if (fileStats.isDirectory()) {
      await copyAssets(fileSourcePath, fileDistPath);
    } else {
      await fsPromises.copyFile(fileSourcePath, fileDistPath);
    }
  });
}

async function run() {
  try {
    await getComponents();
    await replaceTagsWithContent(components);
    await saveModifiedTemplate();
    await createStyleFile();
    await copyAssets(assetsSourcePath, assetsDistPath);
  } catch (err) {
    console.log(err);
  }
}

run();
