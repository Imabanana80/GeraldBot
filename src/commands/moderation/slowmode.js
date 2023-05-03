const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { noPerms, errorMessage } = require("../../utils/functions");

module.exports = class slowmodeSlashCommand extends baseSlashCommand {
  constructor() {
    super("slowmode");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const interactionMember = await interaction.guild.members.fetch(
      `${interaction.user.id}`
    );
    if (interactionMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const timeString = await interaction.options.get("duration").value;
      if (timeString.match(/\d+\s?\w/g)) {
        const seconds = timeString.match(/\d+\s?\w/g).reduce((acc, cur, i) => {
          var multiplier = 1;
          switch (cur.slice(-1)) {
            case "h":
              multiplier *= 60;
            case "m":
              multiplier *= 60;
            case "s":
              return (parseInt(cur) ? parseInt(cur) : 0) * multiplier + acc;
          }
          return acc;
        }, 0);
        if (seconds >= 21600) {
          errorMessage(
            interaction,
            "Error: Duration too long - limit of 21600 seconds"
          );
        } else {
          interaction.channel.setRateLimitPerUser(seconds).then(() => {
            var embed = new EmbedBuilder()
              .setColor(0xfaff86)
              .setDescription(
                `Set the slowmode of ${interaction.channel} to ${timeString}`
              )
              .setTitle("Slowmode Set");
            interaction.editReply({ embeds: [embed] });
          });
        }
      } else {
        errorMessage(
          interaction,
          "Error: Invalid time format (Use <length>s/m/h)"
        );
      }
    } else {
      await noPerms(interaction, "MANAGE CHANNELS");
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Set the slowmode duration of a channel")
      .addStringOption((option) =>
        option
          .setName("duration")
          .setDescription("of slowmode")
          .setRequired(true)
      );
  }
};
