const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const axios = require("axios");
const { errorMessage } = require("../../utils/functions");

module.exports = class skinSlashCommand extends baseSlashCommand {
  constructor() {
    super("skin");
  }
  async run(client, interaction) {
    await interaction.deferReply();
    const username = await interaction.options.get("username").value;
    axios
      .get(`https://api.mojang.com/users/profiles/minecraft/${username}`)
      .then((resp) => {
        if (resp.data.id == undefined) {
          errorMessage(
            client,
            interaction,
            `Error: Username entered is invalid!.\nPlease ensure that a valid minecraft username was entered`
          );
          interaction.editReply({ embeds: [embed] });
        } else {
          const uuid = resp.data.id;
          axios
            .get(
              `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
            )
            .then((res) => {
              var base64data = res.data.properties[0].value;
              var texturedata = JSON.parse(
                Buffer.from(base64data, "base64").toString("ascii")
              );
              if (texturedata.textures.SKIN != undefined) {
                const embed = new EmbedBuilder()
                  .setTitle(`${username}'s skin`)
                  .setURL(`https://namemc.com/profile/${uuid}`)
                  .setDescription(
                    `Click [here](${texturedata.textures.SKIN.url}) to download`
                  )
                  .setImage(`${texturedata.textures.SKIN.url}`)
                  .setColor(0xfaff86);
                interaction.editReply({ embeds: [embed] });
              } else {
                const embed = new EmbedBuilder()
                  .setTitle(`${username}'s skin`)
                  .setDescription(
                    `${username} does not have a skin.\nIn the mean time, enjoy Imabanana80's skin`
                  )
                  .setImage(
                    `https://crafatar.com/renders/body/c4b04ee5c09041f2b34e8e302c626d67?scale=8&overlay`
                  )
                  .setColor(0xfaff86);
                interaction.editReply({ embeds: [embed] });
              }
            });
        }
      });
  }
  getSlashCommandJSON() {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription("Get the target user's minecraft skin")
      .addStringOption((option) =>
        option
          .setName("username")
          .setDescription("MINECRAFT username")
          .setRequired(true)
      );
  }
};
