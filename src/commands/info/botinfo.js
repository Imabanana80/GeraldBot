const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
module.exports = class botinfoSlashCommand extends baseSlashCommand {
  constructor() {
    super("botinfo");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle("Bot Info")
      .setDescription(
        `**Lead Developer: **Imabanana80#0001\n**Language:** [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)\n**Runtime: **[NodeJS](https://nodejs.org/)\n**DiscordAPI Module: **[DiscordJS](https://discord.js.org/#/)\n**AI Provider: **[OpenAI](https://openai.com/)\n**Server Host: **[Vultr - Free $100 credit](https://www.vultr.com/?ref=9014179-8H)`
      );
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Some general infomation about GeraldBot");
  }
};
