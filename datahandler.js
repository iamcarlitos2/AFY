async function createCmd(client, guildId) {
    const data = [
        {
            
             name: 'echo',
            description: 'Escribe tu testo',
            options: [{
                name:'text',
                type:'STRING',
                description: 'Devuelve el texto escrito',
            }],
        
        }
    ]

   await client.guilds.cache.get(guildId)?.commands.create(data);

}

//1095686837604995092