const baseEvent = require("../utils/baseEvent");
const { ActivityType } = require("discord.js");

module.exports = class readyEvent extends baseEvent {
  constructor() {
    super("ready", true);
  }

  run(client) {
    console.log(
      "=============================================================="
    );
    console.log(`Username   : ${client.user.username}`);
    console.log(`Tag        : #${client.user.discriminator}`);
    console.log(`ClientID   : ${client.user.id} `);
    console.log(
      "=============================================================="
    );
    console.log(`${client.readyAt}`);
    console.log(
      "=============================================================="
    );
    console.log("[Client] Bot has been logged in.");
    const presenceOptions = [
      {
        type: ActivityType.Listening,
        text: "(/) commands",
        typeString: "Listening to",
      },
      {
        type: ActivityType.Watching,
        text: "(/) Commands",
        typeString: "Watching",
      },
      {
        type: ActivityType.Playing,
        text: "with (/) Commands",
        typeString: "Playing With",
      },
      {
        type: ActivityType.Watching,
        text: "https://imabanana80.com/discord",
        typeString: "Watching",
      },
      {
        type: ActivityType.Watching,
        text: `${client.guilds.cache.size} Servers`,
        typeString: "Watching",
      },
      {
        type: ActivityType.Watching,
        text: `${client.users.cache.size} Users`,
        typeString: "Watching",
      },
    ];
    setInterval(() => {
      const presence = Math.floor(Math.random() * presenceOptions.length);
      try {
        client.user.setPresence({
          activities: [
            {
              name: presenceOptions[presence].text,
              type: presenceOptions[presence].type,
            },
          ],
          status: "online",
        });
      } catch (err) {
        console.log(`[Error] ${err}`);
      }
    }, 10 * 1000);
  }
};
