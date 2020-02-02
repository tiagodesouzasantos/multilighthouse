const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator");
const fs = require("fs");

const color = require('./console-colors');

module.exports = async(pathJson) => {
    try {
        const listUrls = require(pathJson);

        const opts = {
            output: "json",
            disableDeviceEmulation: true,
            disableStorageReset: true,
            chromeFlags: [
                "--disable-mobile-emulation",
                "--disable-background-timer-throttling"
            ]
        };

        const chrome = await chromeLauncher.launch(opts);
        opts.port = chrome.port;


        for (const page of listUrls) {
            const report = await lighthouse(page.url, opts).then(results => results);
            const html = reportGenerator.generateReport(report.lhr, "html");
            const json = reportGenerator.generateReport(report.lhr, "json");


            fs.writeFile(`report-${page.name}.html`, html, err => {
                if (err) console.error(err);
            });

            fs.writeFile(`report-${page.name}.json`, json, err => {
                if (err) console.error(err);
            });
        }
        chrome.kill();
    } catch (error) {
        console.warn(color.FgMagenta, 'Verifique se o caminho do arquivo json está correto ou se o seu diretório permite gravação de arquivos.');
        console.log(color.Reset);
    }
}