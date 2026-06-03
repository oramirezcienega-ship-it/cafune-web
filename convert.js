const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const assetsDir = path.join(__dirname, 'assets');

// Asegurar que sharp esté instalado
try {
  require('sharp');
} catch (e) {
  console.log('Instalando la librería "sharp" para procesamiento de imágenes...');
  try {
    execSync('npm install sharp', { stdio: 'inherit', cwd: __dirname });
  } catch (error) {
    console.error('Error al instalar sharp con npm. Intentando ejecutar con npx...');
  }
}

const sharp = require('sharp');

// Leer directorio assets
fs.readdir(assetsDir, (err, files) => {
  if (err) {
    console.error('Error al leer assets:', err);
    process.exit(1);
  }

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpeg' || ext === '.jpg' || ext === '.png') {
      const inputPath = path.join(assetsDir, file);
      const outputName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(assetsDir, outputName);

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(info => {
          console.log(`Convertido exitosamente: ${file} -> ${outputName} (${(info.size / 1024).toFixed(1)} KB)`);
        })
        .catch(err => {
          console.error(`Error al convertir ${file}:`, err);
        });
    }
  });
});
