const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logsSchema = require('../../Models/Logs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup-logs")
        .setDescription('Logs de todo el servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("Elige un canal para añadir los logs")
            .setRequired(false)
        ),

        async excute(interaction) {
            const {channel, guildId, options} = interaction;

            const logChannel = options.getChannel("channel") || channel;
            const embed = new EmbedBuilder()

            logsSchema.findOne({Guild: guildId}, async (err, data) => {
                if(!data) {
                    await logsSchema.create({
                        Guild: guildId,
                        Channel: logChannel.id
                    });

                    embed.setDescription("Se han creado los datos correctamente en la base de datos!")
                    .setColor('Green')
                    .setTimestamp();
                } else if (data) {
                    logsSchema.deleteOne({ Guild: guildId });
                    await logsSchema.create({
                        Guild: guildId,
                        Channel: logChannel.id
                    });

                    embed.setDescription("Los anteriores datos han sido reemplazados en la base de datos")
                    .setColor('Green')
                    .setTimestamp();
                }

                if (err) {
                    embed.setDescription("Algo ha ido mal, ponte en contacto con los desarrolladores.")
                    .setColor('Red')
                    .setTimestamp();
                }

                return interaction.reply({ embeds: [embed], ephemeral: true });
            })
        }
}