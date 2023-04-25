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
      .addFields({
        name: "If you would like to see all available commands, check out the [wiki](https://github.com/Imabanana80/GeraldBot/wiki) on github",
        value: `[If you need any more help, click here to contact the developers](https://discord.gg/5GxWqAEdez)`,
      });
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
