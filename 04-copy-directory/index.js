const fsPromises = require('fs/promises');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'files');
const targetFolderPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.rm(targetFolderPath, { force: true, recursive: true });
    await fsPromises.mkdir(targetFolderPath, { recursive: true });
    const files = await fsPromises.readdir(sourceFolderPath);
    files.forEach((file) => {
      const sourceFilePath = path.join(sourceFolderPath, file);
      const targetFilePath = path.join(targetFolderPath, file);
      fsPromises.copyFile(sourceFilePath, targetFilePath);
    });
  } catch (err) {
    console.log(err.message);
  }
}

copyDir();
