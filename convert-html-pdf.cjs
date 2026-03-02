const puppeteer = require('puppeteer');
const path = require('path');

async function convert(htmlFile, pdfFile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Use file:// URL to load the HTML file
    const fileUrl = `file://${path.resolve(htmlFile)}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.pdf({
        path: pdfFile,
        format: 'A4',
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });

    await browser.close();
}

async function main() {
    await convert(
        'LP3/extracted_files/RRA_Parent_Guardian_Code_of_Conduct.html',
        'public/assets/RRA_Parent_Guardian_Code_of_Conduct.pdf'
    );
    console.log('Converted Parent Code of Conduct to PDF.');

    await convert(
        'LP3/extracted_files/RRA_Player_Code_of_Conduct.html',
        'public/assets/RRA_Player_Code_of_Conduct.pdf'
    );
    console.log('Converted Player Code of Conduct to PDF.');
}

main().catch(console.error);
