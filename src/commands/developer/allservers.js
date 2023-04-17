const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class allserversSlashCommand extends baseSlashCommand {
  constructor() {
    super("allservers");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    if (interaction.user.id != process.env.OWNERID) {
      await noPerms(interaction, "BOT OWNER");
    } else {
      let serverlist = "";
      client.guilds.cache.forEach((guild) => {
        serverlist = serverlist.concat(
          `**${guild.name}**` +
            ` (${guild.memberCount})` +
            " - " +
            `${guild.id}` +
            "\n"
        );
      });
      const embed = new EmbedBuilder()
        .setColor(0xfaff86)
        .setTitle(
          `All Servers (${client.users.cache.size} users in ${client.guilds.cache.size} servers)`,
          ""
        )
        .setDescription(serverlist);
      interaction.editReply({ embeds: [embed] });
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("DEVELOPER ONLY COMMAND");
  }
};
