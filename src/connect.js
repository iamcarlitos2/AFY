const MongoClient = require('mongodb')
const { url, dbName } = require('../config.json');
const { trusted } = require('mongoose');
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

async function validateGuild(guID) {
    try {
        if (!connection) {
            connection = await connectToMongoDB();
        }

        const db = connection.db(dbName);
        const collection = db.collection('panel');
        const result = await collection.findOne({ guildID: `${guID}` });
        return result;
    } catch (error) {
        console.error("Error querying MongoDB:", err);
        throw err;
    }
}

async function createPanel(guID, auID, msgID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('panel');

        const result = await collection.insertOne({
            authorID: `${auID}`,
            guildID: `${guID}`,
            messageID: `${msgID}`,
            time: new Date(),
        });

        return result;
    } catch (error) {
        console.error("Error inserting document into MongoDB:", error);
        throw error;
    }
}

async function setupDB(auID, guID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('config');

        const result = await collection.insertOne({
            authorID: `${auID}`,
            guildID: `${guID}`,
            transcript: {
                channel: null,
                webhookID: null,
                webhookToken: null,
            },
            support: {
                roles: null,
            },
            time: new Date(),
        });
        return result;
    } catch (error) {
        console.error("Error inserting document into MongoDB:", error)
        throw error;
    }
}

async function updateTranscript(guID, chID, webhookID, webhookToken) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('config');

        const result = await collection.updateOne(
            {guildID: `${guID}`},
            {
                $set: {
                    transcript: {
                        channel: chID,
                        webhookID: webhookID,
                        webhookToken: webhookToken,
                    },
                },
            }
        );

        return result;
    } catch (error) {
        console.error("Error updating transcript in MongoDB:", error);
        throw error;
    }
}

async function updateRoles(guID, roles) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('config');

        const result = await collection.updateOne(
            {guildID: `${guID}`},
            {
                $set: {
                    support: {
                        roles: roles,
                        
                    },
                },
            }
        );

        return result;
    } catch (error) {
        console.error("Error updating roles in MongoDB", error);
        throw error;
    }
}

async function validateConfig(guID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('config');

        const result = await collection.findOne({ guildID: `${guID}` });

        return result;

    } catch (error) {
        console.error("Error validating config in MongoDB:", error);
        throw error;
    }
}

async function newTicket(guID, auID, chID, msgID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets');

        const result = await collection.insertOne({
            guildID: `${guID}`,
            authorID: `${auID}`,
            channelID: `${chID}`,
            messageID: `${msgID}`,
            add: [],
            status: null,
            time: new Date(),
        });

        return result;

    } catch (error) {
        console.error("Error creating new ticket in MongoDB:", error);
        throw error;
    }
}

async function newTicketPanel(guID, auID, chID, msgID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.insertOne({
            guildID: `${guID}`,
            authorID: `${auID}`,
            channelID: `${chID}`,
            messageID: `${msgID}`,
            status: null,
            time: new Date(),
        });

        return result;

    } catch (error) {
        console.error("Error creating new ticket panel in MongoDB:", error);
        throw error;
    }
}

async function validateTicket_Guild(guID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets');

        const result = await collection.findOne({ guildID: guID });

        return result;

    } catch (error) {
        console.error("Error validating ticket in MongoDB:", error);
        throw error;
    }
}

async function validateTicket_Channel(chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets');

        const result = await collection.findOne({ channelID: chID });

        return result;

    } catch (error) {
        console.error("Error validating ticket in MongoDB:", error);
        throw error;
    }
}

async function validateTicketAuthor(auID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets');

        const result = await collection.find({ authorID: auID }).toArray();

        return result;

    } catch (error) {
        console.error("Error validating ticket author in MongoDB:", error);
        throw error;
    }
}

async function validateTicketPanel_Guild (auID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.findOne({ guildID: guID });

        return result;

    } catch (error) {
        console.error("Error validating ticket panel in MongoDB:", error);
        throw error;
    }
}

async function validateTicketPanel_Channel (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.findOne({ channelID: chID });

        return result;

    } catch (error) {
        console.error("Error validating ticket panel in MongoDB:", error);
        throw error;
    }
}

async function validateTicketPanel_Author (auID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.findOne({ authorID: auID });

        return result;

    } catch (error) {
        console.error("Error validating ticket panel author in MongoDB:", error);
        throw error;
    }
}

async function ticketUpdateStatus_Close (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets');

        const result = await collection.updateOne({ channelID: chID }, { $set: { status: 'closed' } });

        return result;

    } catch (error) {
        console.error("Error updating ticket status to closed in MongoDB:", error);
        throw error;
    }
}

async function ticketUpdateStatus_Reopen (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.updateOne({ channelID: chID }, { $set: { status: null } });

        return result;

    } catch (error) {
        console.error("Error updating ticket status to reopen in MongoDB:", error);
        throw error;
    }
}

async function ticketPanelUpdateStatus_Close  (chID, msgID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.updateOne(
            { channelID: chID },
            { $set: { messageID: msgID, status: 'closed' } }
        );

        return result;

    } catch (error) {
        console.error("Error updating ticket panel status to closed in MongoDB:", error);
        throw error;
    }
}

async function ticketPanelUpdateStatus_Reopen  (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.updateOne(
            { channelID: chID },
            { $set: { status: null } }
        );

        return result;

    } catch (error) {
        console.error("Error updating ticket panel status to reopen in MongoDB:", error);
        throw error;
    }
}

async function updateTicketAdd  (chID, auID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.updateOne(
            { channelID: chID },
            { $push: { add: auID } }
        );

        return result;

    } catch (error) {
        console.error("Error updating ticket add in MongoDB:", error);
        throw error;
    }
}

async function deleteTicket  (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.deleteOne({ channelID: chID });

        return result;

    } catch (error) {
        console.error("Error deleting ticket in MongoDB:", error);
        throw error;
    }
}

async function deleteTicketPanel (chID) {
    try {
        const db = connection.db(dbName);
        const collection = db.collection('tickets-panel');

        const result = await collection.deleteOne({ channelID: chID });

        return result;

    } catch (error) {
        console.error("Error deleting ticket panel in MongoDB:", error);
        throw error;
    }
}

module.exports = {
    validatePanel, validateGuild, createPanel, setupDB, updateTranscript, updateRoles, validateConfig, newTicket, newTicketPanel, validateTicket_Guild, validateTicket_Channel, validateTicketAuthor,
    validateTicketPanel_Guild, validateTicketPanel_Channel, validateTicketPanel_Author, ticketUpdateStatus_Close, ticketUpdateStatus_Reopen, ticketPanelUpdateStatus_Close,
    ticketPanelUpdateStatus_Reopen, updateTicketAdd, deleteTicket, deleteTicketPanel

};