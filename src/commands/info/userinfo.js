const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class userinfoSlashCommand extends baseSlashCommand {
  constructor() {
    super("userinfo");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const targetUser = interaction.options.getUser("user") || interaction.user;
    const targetMember = await interaction.guild.members.fetch(
      `${targetUser.id}`
    );

    var memberRoles = await `${targetMember.roles.cache
      .map((r) => r)
      .join(" ")}`;
    memberRoles = memberRoles.replace("@everyone", " ");
    if (memberRoles === "" || memberRoles === " ") {
      memberRoles = "none";
    }

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.tag}`)
      .setColor(0xfaff86)
      .setThumbnail(`${targetUser.displayAvatarURL()}`)
      .addFields([
        {
          name: `ID`,
          value: `${targetUser.id}`,
          inline: true,
        },
        {
          name: `Account Created`,
          value: `<t:${parseInt(targetUser.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: `Joined Server`,
          value: `<t:${parseInt(targetMember.joinedTimestamp / 1000)}:R>`,
          inline: false,
        },
        {
          name: `Roles`,
          value: `${memberRoles}`,
          inline: false,
        },
        {
          name: `Permissions`,
          value: `${targetMember.permissions.toArray()}`,
          inline: false,
        },
      ]);

    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("View some general infomation about the user")
      .addUserOption((option) =>
        option.setName("user").setDescription("target")
      );
  }
};
