const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

readStream.pipe(process.stdout);

readStream.on('error', (error) => {
  console.log('Error', error.message);
});
