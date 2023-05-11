console.clear();

require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Routes,
  Collection,
  WebhookClient,
} = require("discord.js");
const { REST } = require("@discordjs/rest");
const { registerSlashCommands, registerEvents } = require("./utils/registry");
const readLastLines = require("read-last-lines");
const os = require("os");
const fs = require("fs");
const util = require("util");
const { mongoose } = require("mongoose");
const axios = require("axios");

var log_file = fs.createWriteStream(__dirname + "/console.txt", { flags: "w" });
var log_stdout = process.stdout;

console.log = function (d) {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

console.log(`[Startup] Starting application...`);

//axios fix
axios.defaults.validateStatus = function () {
  return true;
};

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function main() {
  try {
    client.slashCommands = new Collection();
    client.events = new Collection();

    await registerSlashCommands(client, "../commands");
    await registerEvents(client, "../events");

    const slashCommandsJSON = client.slashCommands.map((cmd) =>
      cmd.getSlashCommandJSON()
    );

    console.log("[Startup] Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENTID,
        process.env.GUILDID
      ),
      {
        body: slashCommandsJSON,
      }
    );
    await rest.put(Routes.applicationCommands(process.env.CLIENTID), {
      body: slashCommandsJSON,
    });
    console.log("[Startup] Successfully reloaded application (/) commands.");

    client.events.forEach((event) => {
      if (event.isOnce) {
        client.once(event.name, (...args) => event.run(client, ...args));
      } else {
        client.on(event.name, (...args) => event.run(client, ...args));
      }
    });
    console.log("[Startup] Attempting to connect to MongoDB Database.");
    try {
      mongoose.connect(process.env.MONGOURI).then((success) => {
        console.log(
          "[Startup] Successfully connected to the MongoDB Database."
        );
      });
    } catch (err) {
      console.log(`[Database Error] ${err}`);
    }

    console.log("[Startup] Logging bot in...");
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`[Startup] An unexpected error occured during startup`);
    console.log(`[Startup] ${error.stack}`);
  }
}

const consoleWebhook = new WebhookClient({ url: process.env.CONSOLEWEBHOOK });

const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

function toTimeString(seconds) {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

const starttime = Date.now() / 1000;
var messageid = "";
consoleWebhook.send({ content: `Starting...` }).then((whlogs) => {
  messageid = whlogs.id;
});
setInterval(() => {
  var nowtime = Date.now() / 1000;
  readLastLines.read("./src/console.txt", 25).then((lines) =>
    consoleWebhook
      .editMessage(messageid, {
        content: `\`\`\`ts\n//${os.type()} Kernal\n${lines}\n\n//Device Info\n@@ Memory Used: ${niceBytes(
          os.totalmem() - os.freemem()
        )} @@\n@@ Kernal OS: "${os.platform()}" @@\n@@ Kernal Version: ${os.release()} @@\n@@ UPTIME: ${toTimeString(
          nowtime - starttime
        )} @@\`\`\``,
      })
      .catch((err) => console.log(`[Console Error] - ${err}`))
  );
}, 1 * 1000);

main();

module.exports = {
  niceBytes,
  toTimeString,
  starttime,
};
