const fs = require('fs');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'styles');
const targetFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(targetFilePath);

fs.readdir(sourceFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(sourceFolderPath, file.name);
      const fileExtension = path.extname(filePath);

      if (fileExtension === '.css') {
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(writeStream);
      }
    }
  });
});
