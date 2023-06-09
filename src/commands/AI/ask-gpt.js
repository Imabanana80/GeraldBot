const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const { Configuration, OpenAIApi } = require("openai");
const { noPerms } = require("../../utils/functions");

module.exports = class askgptSlashCommand extends baseSlashCommand {
  constructor() {
    super("ask-gpt");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    if (interaction.user.id != process.env.OWNERID) {
      await noPerms(interaction, "BOT OWNER");
    } else {
      const prompt = interaction.options.get("prompt").value;
      const openaiConfig = new Configuration({
        apiKey: process.env.OPENAIKEY,
      });
      const openai = new OpenAIApi(openaiConfig);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${prompt}`,
        temperature: 0,
        max_tokens: 1024,
      });
      const embed = new EmbedBuilder()
        .setDescription(`\`\`\`${response.data.choices[0].text}\`\`\``)
        .setTitle(`Prompt: ${prompt} `)
        .setFooter({
          text: `Prompt: ${response.data.usage.prompt_tokens} | Response: ${response.data.usage.completion_tokens} | Total: ${response.data.usage.total_tokens}`,
        })
        .setColor(0xfaff86);
      interaction.editReply({ embeds: [embed] });
    }
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Prompt openai's ChatGPT")
      .addStringOption((option) =>
        option
          .setName("prompt")
          .setDescription("What to prompt chatGPT with")
          .setRequired(true)
      );
  }
};
