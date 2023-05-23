const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpia un numero especifico de mensajes')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
        option.setName('cantidad')
        .setDescription('Cantidad de mensajes para limpiar')
        .setRequired(true)
    )
    .addUserOption(option =>
        option.setName('usuario')
        .setDescription('Selecciona un usuario para eliminar sus mensajes')
        .setRequired(false)
    ),

    async execute(interaction) {
        const {channel, options} = interaction;

        const cantidad = options.getInteger('cantidad');
        const usuario = options.getUser('usuario');

        const messages = await channel.messages.fetch({
            limit: cantidad +1,

        });

        const res = new EmbedBuilder()
            .setColor('Red')
        
        if (usuario) {
            let i = 0;
            const filtered = []

            (await messages).filter((msg) => {
                if(msg.author.id === usuario.id && cantidad > i){
                    filtered.push(msg);
                    i++;
                }
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`Mensajes eliminados ${messages.size} del usuario ${usuario}`);
                interaction.reply({embeds: [res]});
            })
        } else {
            await channel.bulkDelete(cantidad, true).then(messages => {
                res.setDescription(`Mensajes eliminados ${messages.size} del canal`);
                interaction.reply({embeds: [res]});
            });
        }
    }
}