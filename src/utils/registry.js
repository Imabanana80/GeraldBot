const path = require("path");
const fs = require("fs/promises");

async function registerSlashCommands(client, dir = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory())
      await registerSlashCommands(client, path.join(dir, file));
    if (file.endsWith(".js")) {
      console.log(`[Startup] Found file ${dir}/${file}`);
      const Command = require(path.join(filePath, file));
      const cmd = new Command();
      client.slashCommands.set(cmd.name, cmd);
      console.log(`[Startup] Registring ${cmd.name} command`);
    }
  }
}

async function registerButtons(client, dir = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await registerButtons(client, path.join(dir, file));
    if (file.endsWith(".js")) {
      console.log(`[Startup] Found file ${dir}/${file}`);
      const Button = require(path.join(filePath, file));
      const button = new Button();
      client.buttons.set(button.name, button);
      console.log(`[Startup] Registring ${button.name} button`);
    }
  }
}

async function registerEvents(client, dir = "") {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await registerButtons(client, path.join(dir, file));
    if (file.endsWith(".js")) {
      console.log(`[Startup] Found file ${dir}/${file}`);
      const Event = require(path.join(filePath, file));
      const event = new Event();
      client.events.set(event.name, event);
      console.log(`[Startup] Registring ${event.name} event`);
    }
  }
}

module.exports = {
  registerSlashCommands,
  registerButtons,
  registerEvents,
};
