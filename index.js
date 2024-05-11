const puppeteer = require("puppeteer");

const config = require("./config.json");

// Étrangement la première icône ne s'affiche pas (donc il faut la mettre en double)
const iconNames = config.icons;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 64, height: 64 });
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FontAwesome Test</title>
        <script src="https://kit.fontawesome.com/3cac1ec1c5.js" crossorigin="anonymous"></script>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 0, 0, 0);
            height: 100vh;
          }
          .way_icon {
            background-color: ${config.color.background};
            border-radius: 10px;
            position: relative;
            width: 48px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .way_icon #icon {
            font-size: 32px;
            background: linear-gradient(to bottom right, ${config.color.icon.first}, ${config.color.icon.second});
            -webkit-background-clip: text;
            -moz-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline;
          }
        </style>
      </head>
      <body>
        <div class="way_icon">
          <i id="icon" class="fa-regular fa-star"></i>
        </div>
      </body>
    </html>
  `);

  // create default folder
  const fs = require("fs");

  const defaultFolder = "./output";
  if (!fs.existsSync(defaultFolder)) {
    fs.mkdirSync(defaultFolder);
  }

  for (const iconName of iconNames) {
    await page.evaluate((iconName) => {
      document.querySelector("#icon").className = `${iconName}`;
    }, iconName);
    await page.screenshot({ path: `${defaultFolder}/icon_${iconName}.png`, omitBackground: true });
  }
  await browser.close();
})();
