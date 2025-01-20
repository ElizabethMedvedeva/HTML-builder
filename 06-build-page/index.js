const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function copyDirectory(source, destination) {
  try {
    await fs.promises.mkdir(destination, { recursive: true });
    const entries = await fs.promises.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, destinationPath);
      } else {
        await fs.promises.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

async function mergeStyle() {
  try {
    const files = await fs.promises.readdir(stylesFolder, {
      withFileTypes: true,
    });
    const bundleStream = fs.createWriteStream(outputCSS);

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        bundleStream.write(data + '\n');
      }
    }
    bundleStream.end();
    console.log('Styles merged successfully');
  } catch (error) {
    console.error('Error merging styles:', error.message);
  }
}

async function buildHTML() {
  try {
    let template = await fs.promises.readFile(templateFile, 'utf-8');
    const tags = template.match(/{{\s*[\w-]+\s*}}/g) || [];

    for (const tag of tags) {
      const componentName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentFile = path.join(
        componentsFolder,
        `${componentName}.html`,
      );

      try {
        const componentContent = await fs.promises.readFile(
          componentFile,
          'utf-8',
        );
        template = template.replace(tag, componentContent);
      } catch {
        console.warn(`Component for tag ${tag} not found: Skipping.`);
      }
    }

    await fs.promises.writeFile(outputHTML, template, 'utf-8');
    console.log('HTML built successfully');
  } catch (error) {
    console.error('Error building HTML:', error.message);
  }
}

async function buildProject() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });
    await buildHTML();
    await mergeStyle();
    await copyDirectory(assetsFolder, outputAssets);

    console.log('Project built successfully');
  } catch (error) {
    console.error('Error while building project:', error.message);
  }
}

buildProject();
