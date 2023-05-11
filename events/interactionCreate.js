const client = require("../index").client 
client.on('interactionCreate', async inter => {
    
    if(inter.isCommand()) {

         let SlashCmds = client.SlashCmds.get(inter.commandName)
        if(SlashCmds) SlashCmds.run(inter)
        }
});