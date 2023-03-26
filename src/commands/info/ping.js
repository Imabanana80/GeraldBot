const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { errorMessage } = require("../../utils/errorMessage");

module.exports = class pingSlashCommand extends baseSlashCommand {
  constructor() {
    super("ping");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    var pingColor = "";
    const codeBlock = "```";
    const ping = Date.now() - interaction.createdTimestamp;
    const apiPing = await client.ws.ping;
    const bothPing = apiPing + ping;
    if (bothPing < 400) {
      pingColor = "Green";
    } else if (bothPing > 400 && bothPing < 600) {
      pingColor = "Orange";
    } else if (bothPing > 600) {
      pingColor = "Red";
    }
    const embed = new EmbedBuilder()
      .setColor(pingColor)
      .setTitle(`🏓 **Pong!**`)
      .addFields(
        {
          name: "Bot latency:",
          value: `${codeBlock}${ping}ms      ${codeBlock}`,
          inline: true,
        },
        {
          name: "API latency:",
          value: `${codeBlock}${apiPing}ms      ${codeBlock}`,
          inline: true,
        }
      );
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Check the latency of the bot");
  }
};
