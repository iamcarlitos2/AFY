module.exports.run = async (client, inter) => {
    const user = inter.options.getUser('target');
    let razonBan = inter.options.getString('razon')
    const member = inter.guild.members.cache.get(user.id);
    if(!member) return inter.reply('Esta persona no se encuentra en el servidor')
    if(!razonBan) razonBan = 'No has especificado una razon'
    
    try {
        await inter.guild.members.ban(member, { razon: razonBan })
    } catch (error) {
        console.log(error)
        return inter.reply('No puedo banear al miembro!')
    }

    inter.reply(`Baneo exitoso, ${user.tag}\nrazon: ${razonBan}`)

}
 
 module.exports.help = {
    name: 'ban'
}
