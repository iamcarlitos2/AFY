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
        
        },

        //ping
        {
            name:'ping',
            description:'Responde con pong'
        },
        //menu ejemplo
        {
            name:'hola',
            type: 3
        },
        //comando purga
        {
            name:'purge',
            description: 'Elimina 300 mensajes',
            options: [{
                name:'cantidad',
                type: 'NUMBER',
                description: 'Cantidad de mensajes para eliminar',
                required: true
            }]
        },
        //comando baneo
        {
            name: 'ban',
            description: 'baneas a un usuario temporalmente',
            options: [{
                name: "target",
                type: 'USER',
                description: 'Usuario que quieres banear',
                required: true
            }]
        },
        //comando kick
        {
            name: 'kick',
            description: 'Expulsas un usuario fuera del servidor',
            options: [{
                name: "target",
                type: 'USER',
                description: 'Usuario que quieres expulsar',
                required: true
            }]
        }
    ]

   await client.guilds.cache.get(guildId)?.commands.create(data);

}

//1095686837604995092