const {EmbedBuilder, GuildMember} = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        Schema.findOne({Guild: member.guild.id}, async (err, data) => {
            if(!data) return;
            let channel = data.Channel;
            let Msg = data.Msg || " ";
            let Role = data.Role;

            const { user, guild } = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
            .setTitle('Bienvenido al club')
            .setDescription(data.Msg)
            .addFields({name: 'Miembros totales', value: `${guild.memberCount}`})
            .setTimestamp()

            welcomeChannel.send({embeds: [welcomeEmbed]});
            member.roles.add(data.Role);
        });
    }
}