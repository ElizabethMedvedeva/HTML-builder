const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const directoryOfDestination = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fs.promises.mkdir(directoryOfDestination, { recursive: true });

    const files = await fs.promises.readdir(directoryOfDestination);
    for (const file of files) {
      const filePath = path.join(directoryOfDestination, file);
      await fs.promises.rm(filePath, { recursive: true, force: true });
    }

    const entries = await fs.promises.readdir(sourceDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destinationPath = path.join(directoryOfDestination, entry.name);

      if (entry.isDirectory()) {
        await copyDirRecursive(sourcePath, destinationPath);
      } else {
        await fs.promises.copyFile(sourcePath, destinationPath);
      }
    }

    console.log('Directory copied successfully');
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

async function copyDirRecursive(source, destination) {
  try {
    await fs.promises.mkdir(destination, { recursive: true });

    const entries = await fs.promises.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await copyDirRecursive(sourcePath, destinationPath);
      } else {
        await fs.promises.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error('Error copying directory recursively:', error.message);
  }
}

copyDirectory();
