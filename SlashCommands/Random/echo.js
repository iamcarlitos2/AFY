module.exports.run = async(inter) => {
    const text = inter.options.getString('text');
    return await inter.reply({ content: text });
}

module.exports.help = {
    name: "echo",
    alias: [],
    permission: []
}