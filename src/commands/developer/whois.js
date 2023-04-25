const { SlashCommandBuilder, EmbedBuilder, Attachment } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const whoiser = require("whoiser");

module.exports = class whoisSlashCommand extends baseSlashCommand {
  constructor() {
    super("whois");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const domain = interaction.options.get("domain").value;
    var domaindata = await whoiser(`${domain}`);
    var buff = Buffer.from(JSON.stringify(domaindata, null, " "), "utf-8");
    await interaction.editReply({
      files: [{ attachment: buff, name: "domaindata.txt" }],
    });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Lookup a domain in the whois database")
      .addStringOption((option) =>
        option.setName("domain").setDescription("to lookup").setRequired(true)
      );
  }
};
