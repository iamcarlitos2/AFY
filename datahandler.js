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
        //comando baneo
        {
            name: 'ban',
            description: 'baneas a un usuario temporalmente',
            options: [{
                name: "target",
                type: 'USER',
                description: 'Usuario que quieres banear',
                required: true
            },
            {
                name: "razon",
                type: 'STRING',
                description: 'Razon del baneo',
                required: false
            }
            ]
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
            },
            {
                
                name: "razon",
                type: 'STRING',
                description: 'Razon de la expulsion',
                required: false
            
            }
            ]
        },
        //perfil
        {
            name: 'perfil',
            description: 'creas un perfil',
            options: [{
                name: 'option',
                description:'Elige algo para editar',
                type: 'STRING',
                choices: [
                   {
                    name: 'name',
                    value: 'user_name'
                   },
                   {
                    name: 'age',
                    value: 'user_age'
                   },
                   {
                    name: 'hobby',
                    value: 'user_age'
                   },
                   {
                    name: 'id',
                    value: 'user_id'
                   },
                   {
                    name: 'look_up',
                    value: 'lookup'
                   }
                ]
            }]
        }
    ]

   await client.guilds.cache.get(guildId)?.commands.create(data);

}

//1095686837604995092