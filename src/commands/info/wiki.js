const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class wikiSlashCommand extends baseSlashCommand {
  constructor() {
    super("wiki");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle("Click here to to visit my wiki!")
      .setURL("https://github.com/Imabanana80/GeraldBot/wiki")
      .setFooter({
        text: "Note: Still in early development. Expect bugs.",
      });
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Check out my wiki.");
  }
};
