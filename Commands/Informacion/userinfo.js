const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { insertMany } = require('discord.js-leveling/models/levels');

module.exports = {
    data : new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Obtienes informacion sobre un usuario')
    .addUserOption(option =>
        option.setName('user')
        .setDescription('Selecciona a un usuario')
        .setRequired(true)
    ),

    async execute(interaction) {
        const { options } = interaction;
        const user = options.getUser('user') || interaction.user;
        const member = await interaction.guild.member.cache.get(user.id);
        const icon = user.displayAvatarURL()
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setAuthor({ name: tag, iconURL: icon})
        .addFields(
            { name: "Name", value: `${user}`, inline: false },
            { name: "Role", value: `${member.roles.cache.map(r => r).join(`` )}`, inline: false },
            { name: "Joined Server", value: `<t:${parseInt(member.user.joinedAt / 1000)}:R>`, inline: true },
            { name: "Joined Discord", value: `<t:${parseInt(member.user.createdAt / 1000)}:R>`, inline: true },
        )
        .setFooter({ text: `User ID: ${user.id}` })
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}