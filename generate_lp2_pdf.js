import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'public/RRA_Melbourne_Elite_Program_LP2.html');
const pdfPath = path.join(__dirname, 'public/RRA_Melbourne_Elite_Program_LP2.pdf');

console.log('Generating polished PDF from your HTML edits...');

try {
    execSync(`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-pdf-header-footer "file://${htmlPath}"`);
    console.log(`\n✅ Success! PDF successfully updated and saved to: ${pdfPath}`);
    console.log('You can now open the PDF to view your changes.');
} catch (error) {
    console.error('\n❌ Error generating PDF. Make sure Google Chrome is installed on this Mac.', error.message);
}
