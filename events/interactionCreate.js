client.on('interactionCreate', async inter => {
    if(inter.isCommand()) {
        if(inter.commandName === 'echo') {
            const text = inter.options.getString('text');
            return await inter.reply({ content: text });
        }
    }
});