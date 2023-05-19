const {EmbedBuilder, GuildMember} = require('discord.js');

module.exports = {
    name: "guildMemberAdd",
    execute(member) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get('885151494897274910');
        const welcomeMessage = `Bienvenido <@${member.id}> a esta puta locura!`;
        const memberRole = '900340423728459797';

        const welcomeEmbed = new EmbedBuilder()
        .setTitle('**Nuevo miembro**')
        .setDescription(welcomeMessage)
        .setColor("DarkVividPink")
        .addFields({name: 'Miembros totales:', value: `${guild.memberCount}`})
        .setTimestamp();

        welcomeChannel.send({embeds: [welcomeEmbed]});
        member.roles.add(memberRole);

    }
}