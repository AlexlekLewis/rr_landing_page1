const { chromium } = require('playwright');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await chromium.launch();
        const page = await browser.newPage();

        console.log('Navigating to http://localhost:5173/offer/preview...');
        await page.setViewportSize({ width: 1280, height: 1080 });
        await page.goto('http://localhost:5173/offer/preview', { waitUntil: 'networkidle', timeout: 30000 });

        await page.waitForTimeout(2000);

        console.log('Generating PDF...');
        await page.pdf({
            path: '/Users/alexlewis/Desktop/Elite_Program_Offer_Review.pdf',
            format: 'A3',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        await browser.close();
        console.log('PDF saved to Desktop as Elite_Program_Offer_Review.pdf');
    } catch (err) {
        console.error('Error during PDF generation:', err);
        process.exit(1);
    }
})();
