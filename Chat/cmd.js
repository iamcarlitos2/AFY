const { exec } = require('child_process');
const { token } = require('../config.json');

function chatExport(channel, user) {
    return new Promise((resolve, reject) => {
        const cmdPrepare = `DiscordChatExporter.Cli.exe export -c ${channel} -t "${token}" -b True -o "${__dirname}\\docs\\${user}-${channel}.html"`;

        exec(`cd .\\Chat\\Discord\\ && ${cmdPrepare}`, (err, stdout, stderr) => {
            if (stdout.indexOf('Done.') !== -1) {
                resolve(__dirname + `\\docs\\${user}-${channel}.html`);
            } else {
                const data = {
                    err: err,
                    stderr: stderr,
                };
                reject(data);
            }
        });
    });
}

module.exports = { chatExport };
