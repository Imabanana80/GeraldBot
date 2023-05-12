const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const os = require("os");
const { niceBytes, toTimeString, starttime } = require("../../index");
const CommandUsage = require("../../schemas/commandUsage");
module.exports = class aboutSlashCommand extends baseSlashCommand {
  constructor() {
    super("about");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const apiPing = await client.ws.ping;
    const nowtime = Date.now() / 1000;
    var totaluses = 0;
    var totalcmds = 0;
    const commandUsages = await CommandUsage.find({});
    commandUsages.forEach((cmd) => {
      totalcmds = totalcmds + 1;
      totaluses = totaluses + cmd.uses;
    });

    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle("About")
      .addFields(
        {
          name: "Metrics",
          value: `
      \`\`┌\`\` **Uptime:** \`${toTimeString(nowtime - starttime)}\`
      \`\`├\`\` **API Latency:** \`${apiPing}ms\` 
      \`\`├\`\` **Commands:** \`${totalcmds}\` 
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
      \`\`├\`\` **Commands ran:** \`\`${totaluses}\`\`
      \`\`└\`\` **Database size:** \`\`--\`\`
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
      .setDescription("Some useful metrics infomation about me!");
  }
};
