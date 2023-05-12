const baseEvent = require("../utils/baseEvent");
// const { InteractionType } = require("discord.js");
const { errorMessage } = require("../utils/functions");
const cooldownManager = new Set();

module.exports = class interactionCreateEvent extends baseEvent {
  constructor() {
    super("interactionCreate", false);
  }

  run(client, interaction) {
    if (interaction.isChatInputCommand()) {
      console.log(
        `[Command] ${interaction} run by ${interaction.user.tag} in ${interaction.guild.name}`
      );
      const { commandName } = interaction;
      const cmd = client.slashCommands.get(commandName);
      console.log(commandName);
      if (cmd) {
        if (cooldownManager.has(interaction.user.id)) {
          interaction.reply(
            "**You're going to fast!**\n> *There is a ``2`` second global cooldown.*"
          );
        } else {
          cmd.run(client, interaction).catch((err) =>
            errorMessage(client, interaction, err).catch((error) => {
              console.log(`[FATAL] ${err.stack}`);
            })
          );
        }
        cooldownManager.add(interaction.user.id);
        setTimeout(() => {
          cooldownManager.delete(interaction.user.id);
        }, 2000);
      }
    }
    // if (interaction.type == InteractionType.MessageComponent) {
    //   if (interaction.isButton()) {
    //     const { customId } = interaction;
    //     if (client.buttons.has(customId)) {
    //       client.buttons.get(customId).run(client, interaction);
    //       console.log(
    //         `[Button] ${interaction.user.tag} clicked ${customId} in ${interaction.guild.id}`
    //       );
    //     }
    //   } else {
    //     return;
    //     // Interaction type is a select menu
    //   }
    // }
  }
};
