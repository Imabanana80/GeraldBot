const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { noPerms } = require("../../utils/functions");

module.exports = class kickSlashCommand extends baseSlashCommand {
  constructor() {
    super("kick");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    let embed = "not an embed yet lol";
    const interactionMember = await interaction.guild.members.fetch(
      `${interaction.user.id}`
    );
    if (interactionMember.permissions.has(PermissionFlagsBits.KickMembers)) {
      const targetUser = await interaction.options.getUser("user");
      const targetMember = await interaction.guild.members.fetch(
        `${targetUser.id}`
      );
      const getReason = interaction.options.get("reason");
      if (!getReason) {
        var reason = "No reason provided";
      } else {
        var reason = interaction.options.get("reason").value;
      }

      if (targetMember) {
        const dm = interaction.options.get("dm").value;
        if (dm) {
          const dmbed = new EmbedBuilder()
            .setColor(0xfaff86)
            .setTitle("You have been kicked!")
            .addFields({
              name: `You have been kicked from ${interaction.guild.name}`,
              value: `Reason: \`\`${reason}\`\`\nBy: \`\`${interaction.user.tag}\`\``,
            })
            .setFooter({ text: `Kicked by: ${interaction.user.tag}` });
          const dmChannel = await targetUser.createDM(false);
          dmChannel.send({ embeds: [dmbed] }).catch((err) => {
            embed = new EmbedBuilder()
              .setColor(0xfaff86)
              .setTitle(`Kicked ${targetUser.username}`)
              .addFields({
                name: `${targetUser.tag} has been kicked from the Server`,
                value: `Reason: \`\`${reason}\`\``,
              })
              .setFooter({
                text: `Punishment issued by ${interaction.user.tag} || UNABLE TO DM USER`,
              });
          });
        }
        targetMember.kick(`${reason}`).then(() => {
          if (typeof embed == "object") {
            interaction.editReply({ embeds: [embed] });
          } else {
            embed = new EmbedBuilder()
              .setColor(0xfaff86)
              .setTitle(`Kicked ${targetUser.username}`)
              .addFields({
                name: `${targetUser.tag} has been kicked from the Server`,
                value: `Reason: \`\`${reason}\`\``,
              })
              .setFooter({
                text: `Punishment given by ${interaction.user.tag}`,
              });
            interaction.editReply({ embeds: [embed] });
          }
        });
      }
    } else {
      noPerms(interaction, "KICK MEMBERS");
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Kick a user from the server")
      .addUserOption((option) =>
        option.setName("user").setDescription("target").setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("dm")
          .setDescription(`the target user or not`)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("for kick")
      );
  }
};
