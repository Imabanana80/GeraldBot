const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class avatarSlashCommand extends baseSlashCommand {
  constructor() {
    super("avatar");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const targetUser =
      (await interaction.options.getUser("user")) || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(targetUser.tag)
      .setColor(0xfaff86)
      .setImage(
        `${targetUser.displayAvatarURL({
          size: 1024,
          format: "png",
          dynamic: true,
        })}`
      )
      .setFooter({ text: `ID: ${interaction.id}` });
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("View the avatar of the target user")
      .addUserOption((option) =>
        option.setName("user").setDescription("target")
      );
  }
};
