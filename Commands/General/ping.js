const {SlashCommandBuilder, CommandInteraction, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong 🏓')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), //solo para administradores
    execute(interaction) {
        interaction.reply({content: "Pong", ephemeral: true}) //ephemeral = solo para que tu veas el mensaje
    },
};