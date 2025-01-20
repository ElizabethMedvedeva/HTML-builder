const fs = require('fs');
const path = require('path');
const styleFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const bundleFile = path.join(outputFolder, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.promises.mkdir(outputFolder, { recursive: true });

    const bundleStream = fs.createWriteStream(bundleFile);

    const files = await fs.promises.readdir(styleFolder, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(styleFolder, file.name);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        bundleStream.write(data + '\n');
      }
    }

    bundleStream.end(() => {
      console.log('Styles merged successfully');
    });
  } catch (error) {
    console.error('Something went wrong:', error.message);
  }
}

mergeStyles();
