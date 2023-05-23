const {Client, ModalBuilder} = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        console.log(`${client.user.username} ready!`);
    },
};