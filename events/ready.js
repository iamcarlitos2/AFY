const client = require("../index").client 
client.on('ready', () => {
    client.user.setPresence({ activities: [{name: 'Developing', type: 'PLAYING'}] })
    console.log(`${client.user.tag} is ready!`)
});