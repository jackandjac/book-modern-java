module.exports = {
  stylesheet: './book-style-zh.css',
  pdf_options: {
    format: 'Letter',
    margin: {
      top: '1in',
      right: '1in',
      bottom: '0.85in',
      left: '1.1in',
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width:100%; font-family:'PingFang SC','Noto Sans SC',sans-serif; font-size:8pt; color:#666; padding:0 1.1in; box-sizing:border-box; display:flex; justify-content:space-between;">
        <span>现代 Java：精通 Java 17、21 和 25 的新特性</span>
        <span class="date"></span>
      </div>`,
    footerTemplate: `
      <div style="width:100%; font-family:'PingFang SC','Noto Sans SC',sans-serif; font-size:9pt; color:#444; padding:0 1.1in; box-sizing:border-box; text-align:center;">
        <span class="pageNumber"></span>
      </div>`,
  },
  launch_options: {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
