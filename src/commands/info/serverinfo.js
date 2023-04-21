const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class serverinfoSlashCommand extends baseSlashCommand {
  constructor() {
    super("serverinfo");
  }
  async run(client, interaction) {
    await interaction.deferReply();

    var community = "";
    if (interaction.guild.features.includes("COMMUNITY")) {
      community = "Enabled";
    } else {
      community = "Not enabled";
    }

    const allRolesFetch = await interaction.guild.roles.fetch();
    const allEmojisFetch = await interaction.guild.emojis.fetch();

    const allChannelsFetch = await interaction.guild.channels.fetch();
    var catCount = 0;
    var txtCount = 0;
    var vcCount = 0;
    var otherCount = 0;
    allChannelsFetch.forEach((channel) => {
      if (channel.type == 4) {
        catCount = catCount + 1;
      } else if (channel.type == 0) {
        txtCount = txtCount + 1;
      } else if (channel.type == 2) {
        vcCount = vcCount + 1;
      } else {
        otherCount = otherCount + 1;
      }
    });

    const ownerFetch = await interaction.guild.members.fetch(
      interaction.guild.ownerId
    );

    const bansFetch = await interaction.guild.bans.fetch();

    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle(`${interaction.guild.name}`)
      .addFields(
        {
          name: "ID",
          value: `${interaction.guild.id}`,
          inline: true,
        },
        {
          name: `Owner ID (${ownerFetch.user.username})`,
          value: `${interaction.guild.ownerId}`,
          inline: true,
        },
        {
          name: "Server Created",
          value: `<t:${parseInt(
            interaction.guild.createdTimestamp / 1000
          )}> [<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>]`,
        },
        {
          name: "Total Members",
          value: `${interaction.guild.memberCount}/${interaction.guild.maximumMembers}`,
          inline: true,
        },
        {
          name: "Boost Level",
          value: `${interaction.guild.premiumTier}`,
          inline: true,
        },
        {
          name: "Community",
          value: `${community}`,
          inline: true,
        },
        {
          name: "Category Channels",
          value: `${catCount}`,
          inline: true,
        },
        {
          name: "Text Channels",
          value: `${txtCount}`,
          inline: true,
        },
        {
          name: "Voice Channels",
          value: `${vcCount}`,
          inline: true,
        },
        { name: `Roles`, value: `${allRolesFetch.size}`, inline: true },
        { name: `Emojis `, value: `${allEmojisFetch.size}`, inline: true },
        { name: `Bans`, value: `${bansFetch.size}`, inline: true }
      )
      .setThumbnail(
        `${
          interaction.guild.iconURL() ||
          "https://cdn.discordapp.com/attachments/1087933287802097715/1098911483271856180/default.png"
        }`
      );
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(
        "View some general info about the server the command is run in "
      );
  }
};
