const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const os = require("os");
const { niceBytes, toTimeString, starttime } = require("../../index.js");
module.exports = class aboutSlashCommand extends baseSlashCommand {
  constructor() {
    super("about");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const ping = Date.now() - interaction.createdTimestamp;
    const apiPing = await client.ws.ping;
    const nowtime = Date.now() / 1000;
    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle("About")
      .addFields(
        {
          name: "Metrics",
          value: `
      \`\`┌\`\` **Uptime:** \`${toTimeString(nowtime - starttime)}\`
      \`\`├\`\` **Bot Latency:** \`${ping}ms\`
      \`\`├\`\` **API Latency:** \`${apiPing}ms\` 
      \`\`└\`\` **Ram Usage:** \`\`${niceBytes(
        os.totalmem() - os.freemem()
      )}/${niceBytes(os.totalmem())}\`\`
      `,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        {
          name: "Engagement",
          value: `
      \`\`┌\`\` **Servers:** \`\`${client.guilds.cache.size}\`\`
      \`\`├\`\` **Users:** \`\`${client.users.cache.size}\`\`
      \`\`├\`\` **Messages:** \`\`--\`\`
      \`\`└\`\` **Commands Ran:** \`\`--\`\`
      `,
          inline: true,
        },
        {
          name: "Dev Info",
          value: `
        \`\`┌\`\` **Developer:** [Imabanana80](https://imabanana80.com/)
        \`\`├\`\` **Language:** [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
        \`\`├\`\` **Module:** [DiscordJS](https://discord.js.org/#/)
        \`\`└\`\` **Server Host:** [Vultr](https://www.vultr.com/?ref=9014179-8H)
        `,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        {
          name: "Links",
          value: `
        \`\`┌\`\` [Invite](https://discord.com/oauth2/authorize?client_id=1024281696494964746&permissions=2194727632767&scope=bot%20applications.commands)
        \`\`├\`\` [Source](https://github.com/imabanana80/GeraldBot)
        \`\`├\`\` [Wiki](https://github.com/imabanana80/GeraldBot/wiki)
        \`\`└\`\` [Support](https://discord.gg/5GxWqAEdez)
        `,
          inline: true,
        }
      );
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Some possibly useful infomation about me!");
  }
};
