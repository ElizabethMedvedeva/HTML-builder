const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Insert your text. To exit, type "exit" or press "Ctrl + C".');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    farewell();
  } else {
    writeStream.write(`${input}\n`, (err) => {
      if (err) {
        console.error('Error while writing to file:', err.message);
      }
    });
  }
});

process.on('SIGINT', farewell);

function farewell() {
  console.log('See you! The program is complete.');
  writeStream.end();
  rl.close();
  process.exit();
}
