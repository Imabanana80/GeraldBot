const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { noPerms } = require("../../utils/functions");

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
          `${guild.name}` +
            ` (${guild.memberCount})` +
            " - " +
            `${guild.id}` +
            "\n"
        );
      });

      var buff = Buffer.from(serverlist, "utf-8");
      interaction.editReply({
        content: `**${client.users.cache.size} users in ${client.guilds.cache.size} servers**`,
        files: [{ attachment: buff, name: "serverlist.txt" }],
      });
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("DEVELOPER ONLY COMMAND");
  }
};
