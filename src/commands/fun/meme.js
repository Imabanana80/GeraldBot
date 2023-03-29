const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const baseSlashCommand = require("../../utils/baseSlashCommand");

module.exports = class memeSlashCommand extends baseSlashCommand {
  constructor() {
    super("meme");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    console.log("[Axios] Requesting meme from https://www.reddit.com/r/memes/");
    const res = await axios.get(`https://www.reddit.com/r/memes/random/.json`);
    const embed = new EmbedBuilder()
      .setColor(0xfaff86)
      .setTitle(`${res.data[0].data.children[0].data.title}`)
      .setImage(`${res.data[0].data.children[0].data.url}`)
      .setFooter({
        text: `Upvotes: ${res.data[0].data.children[0].data.ups} | Source: r/memes`,
      })
      .setURL(
        `https://www.reddit.com${res.data[0].data.children[0].data.permalink}`
      );
    interaction.editReply({ embeds: [embed] });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Get a meme from reddit - r/memes");
  }
};
