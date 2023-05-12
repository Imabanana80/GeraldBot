const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class inviteSlashCommand extends baseSlashCommand {
  constructor() {
    super("invite");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle("Click here to invite me!")
      .setURL(
        "https://discord.com/oauth2/authorize?client_id=1024281696494964746&permissions=2194727632767&scope=applications.commands%20bot"
      )
      .setFooter({
        text: "Note: Still in early development. Expect bugs.",
      });
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Invite the bot to another server");
  }
};
