const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            const filePathObj = path.parse(filePath);
            const fileName = filePathObj.name;
            const fileExt = filePathObj.ext.slice(1);
            const fileSizeKb = (stats.size / 1024).toFixed(3);
            console.log(`${fileName} - ${fileExt} - ${fileSizeKb}kb`);
          }
        });
      }
    });
  }
});
