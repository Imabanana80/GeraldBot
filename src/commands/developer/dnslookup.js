const { SlashCommandBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const dnsPromises = require("node:dns").promises;

module.exports = class dnslookupSlashCommand extends baseSlashCommand {
  constructor() {
    super("dnslookup");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const domain = interaction.options.get("domain").value;
    await dnsPromises.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);
    var result = await dnsPromises.resolve(`${domain}`, "A");
    var buff = Buffer.from(result.join("\n"), "utf-8");
    await interaction.editReply({
      files: [{ attachment: buff, name: "dns.txt" }],
    });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("view the DNS 'A' records of the specified domain/url")
      .addStringOption((option) =>
        option.setName("domain").setDescription("to lookup").setRequired(true)
      );
  }
};
