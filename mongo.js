const mongoose = require('mongoose');
const { mongoPath } = require('./config.json');

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    return mongoose
}

mongoose.connection.on("connected", () => {
    console.log('Conectado a la base de datos!')
});