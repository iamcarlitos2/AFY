const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Silencias a un miembro del servidor")
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(option => 
            option.setName("target")
            .setDescription("Selecciona al usuario que deseas silenciar")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("time")
            .setDescription("Elige el tiempo que deseas silenciar a la persona")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Razon del muteo")
            .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser("target");
        const member = await interaction.guild.members.fetch(user.id);
        const time = options.getString("time");
        const convertedTime = ms(time);
        const reason = options.getString("reason");

        const errEmbed = new EmbedBuilder()
            .setDescription(":x: Algo ha salido mal, intentalo mas tarde!")
            .setColor('Red')
        
        const succesEmbed = new EmbedBuilder()
            .setTitle("✅ **Silenciado**")
            .setDescription(`Se ha silenciado correctamente al usuario: ${user}`)
            .addFields(
                { name: "Reason", value: `${reason}`, inline: true},
                { name: "Duration", value: `${time}`, inline: true}

            )
            .setColor('Green')
            .setTimestamp();
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        if(!interaction.guild.members.me.permission.has(PermissionFlagsBits.ModerateMembers))
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        if(!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        
        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [succesEmbed], ephemeral: true });
        } catch (error) {
            console.log(error);
        }

    }

}