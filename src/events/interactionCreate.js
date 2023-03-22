const baseEvent = require("../utils/baseEvent");
// const { InteractionType } = require("discord.js");
const { errorMessage, errorMessageEdit } = require("../utils/errorMessages");
const talkedRecently = new Set();

module.exports = class interactionCreateEvent extends baseEvent {
  constructor() {
    super("interactionCreate", false);
  }

  run(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      const cmd = client.slashCommands.get(commandName);
      if (cmd) {
        if (talkedRecently.has(interaction.user.id)) {
          interaction.reply(
            "**You're going to fast!**\n> *There is a ``2`` second global cooldown.*"
          );
        } else {
          cmd.run(client, interaction).catch((err) =>
            errorMessage(interaction, err).catch((error) => {
              errorMessageEdit(interaction, err);
            })
          );
        }
        talkedRecently.add(interaction.user.id);
        setTimeout(() => {
          talkedRecently.delete(interaction.user.id);
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
