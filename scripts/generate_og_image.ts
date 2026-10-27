import { chromium } from 'playwright';
import * as path from 'path';

async function generateOgImage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;800;900&family=Merriweather:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1200px;
          height: 630px;
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(135deg, #ffcb37 0%, #fffaea 100%);
          color: #4a3c31;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px 80px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle Honeycomb Pattern Overlay */
        body::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.12;
          background-image:
            radial-gradient(circle, #ffb800 2.5px, transparent 3px),
            radial-gradient(circle, #ffb800 2.5px, transparent 3px);
          background-size: 36px 36px;
          background-position: 0 0, 18px 18px;
          pointer-events: none;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          font-family: 'Dancing Script', cursive;
          font-size: 72px;
          font-weight: 700;
          color: #4a3c31;
          transform: rotate(-3deg);
          line-height: 1;
          text-shadow: 2px 2px 0px rgba(143, 118, 99, 0.15);
        }

        .badge-brand {
          background: #ffffff;
          color: #4a3c31;
          border: 2px solid #e8e6e1;
          padding: 8px 18px;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 4px 12px rgba(143,118,99,0.06);
        }

        .content {
          position: relative;
          z-index: 2;
          margin-top: 20px;
        }

        .headline {
          font-family: 'Merriweather', serif;
          font-size: 48px;
          font-weight: 700;
          color: #4a3c31;
          line-height: 1.25;
          margin-bottom: 16px;
          max-width: 950px;
        }

        .subhead {
          font-size: 22px;
          font-weight: 600;
          color: #8f7663;
          line-height: 1.5;
          max-width: 900px;
          margin-bottom: 32px;
        }

        .pills {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .pill {
          background: #ffffff;
          border: 2px solid #ffcb37;
          color: #4a3c31;
          padding: 10px 22px;
          border-radius: 9999px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(143,118,99,0.05);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
          border-top: 2px solid rgba(143, 118, 99, 0.15);
          padding-top: 24px;
        }

        .domain {
          font-size: 20px;
          font-weight: 800;
          color: #4a3c31;
          letter-spacing: 0.05em;
        }

        .tagline {
          font-size: 16px;
          font-weight: 700;
          color: #8f7663;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <div class="logo">moonine</div>
        </div>
        <div class="badge-brand">A Vedic Matchmaker</div>
      </div>

      <div class="content">
        <h1 class="headline">Find Celestial Harmony with Vedic Astrology Matchmaking</h1>
        <p class="subhead">Discover verified life partners with 36-point Ashta Koota Guna Milan, Dosha analysis, and respectful human vetting.</p>

        <div class="pills">
          <div class="pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3c31" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            36-Point Guna Milan
          </div>
          <div class="pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3c31" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Manglik Dosha Analysis
          </div>
          <div class="pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3c31" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Verified Profiles
          </div>
          <div class="pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a3c31" stroke-width="2.5"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="M12 8v4l3 3"/></svg>
            Free Kundli Calculator
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="domain">https://moonine.netlify.app</div>
        <div class="tagline">Traditional Wisdom · Modern Connections</div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });
  // Wait for Google Fonts to finish loading
  await page.evaluate(() => document.fonts.ready);

  const outputPath = path.resolve('public/og-image.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log(`Successfully generated OG image at: ${outputPath}`);

  await browser.close();
}

generateOgImage().catch((err) => {
  console.error('Failed to generate OG image:', err);
  process.exit(1);
});
