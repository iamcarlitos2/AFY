const MongoClient = require('mongodb')
const { url, dbName } = require('../config.json');
//definimos conexion
let connection;

async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        console.log('Te has conectado correctamente a la base de popyfres');
        return client;
    } catch (error) {
        console.log('Erro al conectarse a mongo', error);
        throw error;
    }
}

async function validatePanel(msgID) {
    try {
        if (!connection) {
            connection = await connectToMongoDB();
        }

        const db = connection.db(dbName);
        const collection = db.collection('panel');
        const result = await collection.findOne({ messageID: `${msgID}` });
        return result;

    } catch (error) {
        console.error("Error querying MongoDB:", error);
        throw error;
    }
}

module.exports = {
    validatePanel,
};