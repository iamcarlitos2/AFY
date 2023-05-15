module.exports.run = async (client, inter) => {
    const user = inter.options.getUser('target');
    let razonExpulsion = inter.options.getString('razon')
    const member = inter.guild.members.cache.get(user.id);
    if(!member) return inter.reply('Esta persona no se encuentra en el servidor')
    if(!razonExpulsion) razonExpulsion = 'No has especificado una razon'
    
    try {
        await inter.guild.members.kick(member, { razon: razonExpulsion })
    } catch (error) {
        console.log(error)
        return inter.reply('No puedo expulsar al miembro!')
    }

    inter.reply(`Expulsado, ${user.tag}\nrazon: ${razonExpulsion}`)

}
 
 module.exports.help = {
    name: 'kick'
}
