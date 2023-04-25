const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { noPerms } = require("../../utils/functions");

module.exports = class automodSlashCommand extends baseSlashCommand {
  constructor() {
    super("automod");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const interactionMember = await interaction.guild.members.fetch(
      `${interaction.user.id}`
    );
    if (interactionMember.permissions.has(PermissionFlagsBits.Administrator)) {
      const sub = interaction.options.getSubcommand();
      switch (sub) {
        case "discord-invites":
          await interaction.editReply({ content: "loading automod rule..." });
          const inviteRule = await interaction.guild.autoModerationRules.create(
            {
              name: `Block discord invite links. Powered by Gerald`,
              creatorId: `1024281696494964746`,
              enabled: true,
              eventType: 1,
              triggerType: 1,
              triggerMetadata: {
                keywordFilter: ["*discord.gg/*", "*discord.com/invite/*"],
              },
              actions: [
                {
                  type: 1,
                  metadata: {
                    customMessage:
                      "This message was blocked by Gerald as it contains a Discord Invite",
                  },
                },
              ],
              reason: `Requested by ${interaction.user}`,
            }
          );
          await interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor(0xfaff96)
                .setTitle("Added automod rule")
                .setDescription(
                  "Gerald now blocks discord server invite links!"
                )
                .setFooter({
                  text: "configure exempted channels and roles & setup logs manually in your server's automod settings...",
                }),
            ],
          });
          break;
        case "discord-gifts":
          await interaction.editReply({ content: "loading automod rule..." });
          const giftRule = await interaction.guild.autoModerationRules.create({
            name: `Block gift links. Powered by Gerald`,
            creatorId: `1024281696494964746`,
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata: {
              keywordFilter: ["*discord.gift*"],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  customMessage:
                    "This message was blocked by Gerald as it contains a discord gift link",
                },
              },
            ],
            reason: `Requested by ${interaction.user}`,
          });
          await interaction.editReply({
            content: "",
            embeds: [
              new EmbedBuilder()
                .setColor(0xfaff96)
                .setTitle("Added automod rule")
                .setDescription("Gerald now blocks discord gift links!")
                .setFooter({
                  text: "configure exempted channels and roles & setup logs manually in your server's automod settings...",
                }),
            ],
          });
          break;
      }
    } else {
      await noPerms(interaction, "ADMINISTRATOR");
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Setup some pre-built automod configurations")
      .addSubcommand((command) =>
        command
          .setName("discord-invites")
          .setDescription("Block discord invite links")
      )
      .addSubcommand((command) =>
        command
          .setName("discord-gifts")
          .setDescription("Block discord gift links")
      );
  }
};
