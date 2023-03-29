const baseEvent = require("../utils/baseEvent");
const { EmbedBuilder } = require("discord.js");

module.exports = class messageCreateEvent extends baseEvent {
  constructor() {
    super("messageCreate", false);
  }

  async run(client, message) {
    if (
      message.content.includes(`<@${process.env.CLIENTID}>`) ||
      message.content.includes(`@${process.env.CLIENTUSERNAME}`)
    ) {
      const pingembed = new EmbedBuilder()
        .setTitle("You pinged me! How can i help?")
        .setColor(0xfaff86)
        .setDescription(
          "To see a full list of my [slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) check out my [top.gg](https://top.gg/bot/1024281696494964746) page or type / and click my icon. If you need more help feel free to contact the developers [here](https://discord.gg/5GxWqAEdez)"
        );
      message.reply({ embeds: [pingembed] });
      console.log(`[Ping] I was pinged in ${message.guild.id}`);
    }
  }
};
