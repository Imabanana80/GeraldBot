const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { errorMessage, noPerms } = require("../../utils/functions");

module.exports = class addemojiSlashCommand extends baseSlashCommand {
  constructor() {
    super("addemoji");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const interactionMember = await interaction.guild.members.fetch(
      `${interaction.user.id}`
    );

    if (
      interactionMember.permissions.has(
        PermissionFlagsBits.ManageGuildExpressions
      )
    ) {
      const emoji = interaction.options.get("emoji").value;
      const emojiName = interaction.options.get("name").value;
      if (emoji.startsWith("<") && emoji.endsWith(">")) {
        var emojiurl = "";
        const id = emoji.match(/\d{15,}/g)[0];
        if (emoji.startsWith("<a:")) {
          emojiurl = `https://cdn.discordapp.com/emojis/${id}.gif?quality=lossless`;
        } else {
          emojiurl = `https://cdn.discordapp.com/emojis/${id}.png?quality=lossless`;
        }

        await interaction.guild.emojis
          .create({ attachment: emojiurl, name: emojiName })
          .then((emoji) => {
            const embed = new EmbedBuilder()
              .setTitle("Emoji added!")
              .setDescription(`Added ${emoji}`)
              .setColor(0xfaff86);
            interaction.editReply({ embeds: [embed] });
          });
      } else {
        errorMessage(client, interaction, "Error: Invalid Emoji");
      }
    } else {
      await noPerms(interaction, "MANAGE EXPRESSIONS");
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Add an emoji to the server")
      .addStringOption((option) =>
        option.setName("emoji").setDescription(":pepelaugh:").setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("to set for the new emoji")
          .setRequired(true)
      );
  }
};
