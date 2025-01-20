const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  try {
    const dirEntries = await fs.promises.readdir(pathToFolder, {
      withFileTypes: true,
    });

    for (const entry of dirEntries) {
      if (entry.isFile()) {
        const filePath = path.join(pathToFolder, entry.name);
        const stats = await fs.promises.stat(filePath);
        const fileSize = (stats.size / 1024).toFixed(3);
        const fileName = path.parse(entry.name).name;
        const fileExt = path.parse(entry.name).ext.slice(1);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

displayFilesInfo();
