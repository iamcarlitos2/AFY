const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, IntentsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Lista de todos los comandos del bot!"),
    async execute(interaction) {
        const emojis = {
            info: "📃",
            moderacion: "🛠",
            general: "📌",
        };

        const directories = {
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),
        };

        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands.filter((cmd) => cmd.folder === dir).map((cmd) => {
                return {
                    name: cmd.data.name,
                    description: cmd.data.description
                };
            });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
        .setDescription("Elige una categoria del menú");

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new SelectMenuBuilder()
                .setCustomId("help-menu")
                .setPlaceholder('Elige una categoria')
                .setDisabled(state)
                .addOptions(
                    categories.map((cmd) => {
                        return {
                            label: cmd.directory,
                            value: cmd.directory.toLowerCase(),
                            description: `Comandos de la categoria ${cmd.directory}`,
                            emoji: emojis[cmd.directory.toLowerCase() || null],
                        };
                    })
                )
            ),
        ];

        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.SelectMenu,
        });

        collector.on("collect", (interaction) => {
            const [directory] = interaction.values;
            const categoria = categories.find(
                (x) = x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
            .setTitle(`Comandos ${formatString(directory)}`)
            .setDescription(`Lista de comandos por categorias ${directory}`)
            .addFields(
                categoria.commands.map((cmd) => {
                    return {
                        name: `\`${cmd.name}\``,
                        value: cmd.description,
                        inline: true,
                    };
                })
            );

            interaction.update({embeds: [categoryEmbed]});
        });

        collector.end("end", () => {
            initialMessage.edit({ components: components(true) });
        });
    },
};