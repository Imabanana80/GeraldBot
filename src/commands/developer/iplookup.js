const { SlashCommandBuilder, EmbedBuilder, Attachment } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const whoiser = require("whoiser");

module.exports = class iplookupSlashCommand extends baseSlashCommand {
  constructor() {
    super("iplookup");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const ip = interaction.options.get("ip").value;
    var ipdata = await whoiser.ip(`${ip}`);
    var buff = Buffer.from(JSON.stringify(ipdata, null, " "), "utf-8");
    await interaction.editReply({
      files: [{ attachment: buff, name: "ipdata.txt" }],
    });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Lookup a IP address in the whois database")
      .addStringOption((option) =>
        option.setName("ip").setDescription("IPv4 address").setRequired(true)
      );
  }
};
