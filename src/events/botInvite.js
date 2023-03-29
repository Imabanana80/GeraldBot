const baseEvent = require("../utils/baseEvent");
const { EmbedBuilder } = require("discord.js");

module.exports = class guildcreateEvent extends baseEvent {
  constructor() {
    super("guildCreate", false);
  }

  async run(client, guild) {
    const embed = new EmbedBuilder()
      .setTitle("Thanks For adding me!")
      .setColor(0xfaff86)
      .addFields(
        // {
        //   name: "Firstly, here are some useful configuration commands you may want to set up",
        //   value: `</setembedcolor:1043173307970752564> - This allows you to choose what color (hex code) you want to have used for embeds.\n</setcounter:1043173307970752563> - You can configure a counter to show how many member there are in the server`,
        // },
        // {
        //   name: "Next, check out some of my most popular commands!",
        //   value: `</addemoji:1046800406270967828> - this allows you to snipe emojis from other servers\n</avatar:1024284809046020157> - get another user, or yourself's, avatar\n</coinflip:1047363231930396672> - flip a coin lol\n</uuid:1040172075446444105> - get the uuid of a minecraft player from mojang's api`,
        // },
        {
          name: "If you would like to see all available commands, type / and click my icon in the message bar",
          value: `[If you need any more help, click here to contact the developers](https://discord.gg/5GxWqAEdez)`,
        }
      );
    const guildchannels = await guild.channels.fetch();
    const channeltosend = guildchannels.filter(
      (channel) => channel.type == "0"
    );
    console.log(`[oAuth] The bot was invited to ${guild.name} - ${guild.id}`);
    await channeltosend
      .first()
      .send({ embeds: [embed] })
      .catch((err) => console.log(`[Error] ${err}`));
  }
};
