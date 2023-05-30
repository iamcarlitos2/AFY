const { SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Cambia la presencia del bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) //solo usuarios administradores
        .addSubcommand(subcomand =>
            subcomand.setName('activity')
            .setDescription('Cambia la actividad del bot')
            .addStringOption(option =>
                option.setName('type')
                .setDescription('Escoge una actividad')
                .setRequired(true)
                .addChoices(
                    {name: "Playing", value: "Playing"},
                    {name: "Watching", value: "Watching"},
                    {name: "Streaming", value: "Streaming"},
                    {name: "Listening", value: "Listening"},
                    {name: "Competing", value: "Competing"},
                )
            )
            .addStringOption(option =>
                option.setName("activity")
                .setDescription("Escribe la actividad que desees.")
                .setRequired(true)
            )
        )

        .addSubcommand(subcomand =>
            subcomand.setName("status")
            .setDescription("Cambia el status del bot")
            .addStringOption(option =>
                option.setName("type")
                .setDescription("Escoge un status")
                .setRequired(true)
                .addChoices(
                    {name: "Online", value: "online"},
                    {name: "Idle", value: "idle"},
                    {name: "Dnd", value: "dnd"},
                    {name: "Offline", value: "offline"},
                )
            )
        ),

        async execute(interaction, client) {
            const { options } = interaction;

            const sub = options.getSubcommand(["activity", "status"]);
            const type = options.getString("type");
            const activity = options.getString("activity") ;
            

            try {
                
                switch (sub) {
                    case "activity":
                        switch(type){
                            case "Playing":
                                client.user.setActivity(activity, { type: ActivityType.Playing });
                            break;
                            case "Streaming":
                                client.user.setActivity(activity, { type: ActivityType.Streaming });
                            break;
                            case "Listening":
                                client.user.setActivity(activity, { type: ActivityType.Listening });
                            break;
                            case "Watching":
                                client.user.setActivity(activity, { type: ActivityType.Watching });
                            break;
                            case "Competing":
                                client.user.setActivity(activity, { type: ActivityType.Competing });
                            break;
                        }
                        break;
                
                    case "status":
                        client.user.setPresence({ status: type });
                        break;
                }

            } catch (error) {
                console.log(error);
            }

            const embed = new EmbedBuilder();

            return interaction.reply({ embeds: [embed.setDescription(`Ha cambiado tu ${sub} a ${type}`)] });
        }
        
}