const rrSchema = require('../../Models/ReactionRoles');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Panel donde se mostraran los roles para reaccionar.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

        async execute(interaction) {
            const { options, guildId, guild, channel } = interaction;

            try {
                const data = await rrSchema.findOne({ GuildID: guildId });

                if (!data.roles.length > 0)
                    return interaction.reply({content: `Este servidor no tiene ningun dato`, ephemeral: true});

                    const panelEmbed = new EmbedBuilder()
                        .setDescription("Selecciona los roles, segun tus necesidades.")
                        .setColor("Fuchsia")
                    const options = data.roles.map(x => {
                        const role = guild.roles.cache.get(x.roleId);

                        return {
                            label: role.name,
                            value: role.id,
                            description: x.roleDescription,
                            emoji: x.roleEmoji || undefined
                        };
                    });

                    const menuComponents = [
                        new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('reaction-roles')
                                    .setMaxValues(options.length)
                                    .addOptions(options),
                            ),
                    ];

                    channel.send({ embeds: [panelEmbed], components: menuComponents});

                    return interaction.reply({ content: `Se ha enviado de forma correcta el panel.`, ephemeral: true});
            } catch (error) {
                console.log(error);
            }
        }
}