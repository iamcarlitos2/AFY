//defines el schema
const schema = require('../../model/profiles');

module.exports.run = async (client, inter) => {
    const choice = inter.options.getString("option")

    //buscas al usuario en la base de datos, en caso de no encontralo, crea uno
    let data;
    try {
        data = await schema.findOne({ userId: inter.user.id })
        if(!data) data = await schema.create({ userId: inter.user.id })
    } catch (error) {
        //error 
        console.log(error)
    }

    if(choice === 'user_name') {
        await inter.reply('Envia tu nombre')
        const filter = msg => msg.author.id === inter.user.id
        await inter.channel.awaitMessages({ filter: filter, max: 1}).then(async col => {
            if(!data.CustomId) await inter.followUp(`Establece tu nombre ${col.first().content}`)
            await inter.followUp(`Establece tu nombre ${col.first().content}`)
            data.UserName = col.first().content
            await data.save()
        })
    }
}

module.exports.help = {
    name:'profile'
}