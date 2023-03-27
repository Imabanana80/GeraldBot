const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const {} = require("../../utils/functions");

module.exports = class devtoolsSlashCommand extends baseSlashCommand {
  constructor() {
    super("devtools");
  }
  async run(client, interaction) {
    require("dotenv").config();
    await interaction.deferReply();
    if (interaction.user.id != process.env.OWNERID) {
      await noPerms(interaction, "BOT OWNER");
    } else {
      const cmd = await interaction.options.get("cmd").value;
      const args = await interaction.options.get("args").value;

      if (cmd == "invite") {
        console.log(`[Dev] Invite link request sent for ${args}`);
        const targetGuild = await client.guilds.fetch(`${args}`);
        const guildChannels = await targetGuild.channels.fetch();
        const channelToSend = guildChannels.filter(
          (channel) => channel.type == "0"
        );

        await targetGuild.invites
          .create(channelToSend.first().id)
          .then((invite) => {
            interaction.editReply("Invite code successfully generated");
            interaction.channel.send(`https://discord.gg/${invite.code}`);
          });
      }
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Tools to help the developer")
      .addStringOption((option) =>
        option.setName("cmd").setDescription("cmd").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("args").setDescription("args").setRequired(true)
      );
  }
};
