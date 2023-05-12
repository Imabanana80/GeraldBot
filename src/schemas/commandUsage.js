const { Schema, model } = require("mongoose");

const commandUsage = new Schema({
  command: { type: String, required: true },
  uses: { type: Number, required: true },
});

module.exports = new model("CommandUsage", commandUsage);
