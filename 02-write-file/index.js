const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write(
  '\nHey there!\n' +
    'Please, enter your text to write to the file "text.txt".\n' +
    'To finish, press Ctrl+C or eneter keyword "exit"\n\n',
);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
  writeStream.write(data.toString());
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('\n\nYour text was written.\n'));
