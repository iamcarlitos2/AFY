const { model, Schema } = require('mongoose');

let logsSchema = new Schema({
    Guild: String,
    Channel: String,
});

module.exports = model("Logs", logsSchema);