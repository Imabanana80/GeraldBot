const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { noPerms, errorMessage } = require("../../utils/functions");

module.exports = class purgeSlashCommand extends baseSlashCommand {
  constructor() {
    super("purge");
  }
  async run(client, interaction) {
    await interaction.deferReply({ ephemeral: true });
    const interactionMember = await interaction.guild.members.fetch(
      `${interaction.user.id}`
    );
    if (interactionMember.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const purgeAmount = interaction.options.get("amount").value;
      if (purgeAmount > 100) {
        errorMessage(
          client,
          interaction,
          "Error: Cannot purge more than 100 messages at a time"
        );
      } else {
        const embed = new EmbedBuilder()
          .setTitle("Successfully Purged Messages")
          .setColor(0xfaff86)
          .setDescription(
            `Purged \`\`${purgeAmount}\`\` messages from ${interaction.channel}`
          );
        interaction.channel.bulkDelete(purgeAmount).then(() => {
          interaction.editReply({ embeds: [embed], ephemeral: true });
        });
      }
    } else {
      await noPerms(interaction, "MANAGE MESSAGES");
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Purge messages from a channel")
      .addIntegerOption((option) =>
        option.setName("amount").setDescription("messages").setRequired(true)
      );
  }
};
