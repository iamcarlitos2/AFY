client.on('ready', () => {
    client.user.setPresence({ activities: [{name: 'Developing', type: 'PLAYING'}] })
    console.log(`${client.user.tag} is ready!`)

    const data = {
        name: 'echo',
        description: 'Escribe tu testo',
        options: [{
            name:'text',
            type:'STRING',
            description: 'Devuelve el texto escrito',
            required: true,
        }],
    };

    const command = client.guilds.cache.get('1095686837604995092')?.commands.create(data);
});