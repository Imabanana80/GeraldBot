const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const baseSlashCommand = require("../../utils/baseSlashCommand");
const axios = require("axios");

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
          const embed = new EmbedBuilder()
            .setDescription(
              `The username \`\`${username}\`\` is invalid or does not exist`
            )
            .setColor("Red");
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
                  .setDescription(
                    `Click [here](${texturedata.textures.SKIN.url}) to download this skin`
                  )
                  .setImage(`https://visage.surgeplay.com/full/${uuid}`)
                  .setColor(0xfaff86)
                  .setFooter({ text: `${uuid}` });
                interaction.editReply({ embeds: [embed] });
              } else {
                const embed = new EmbedBuilder()
                  .setTitle(`${username}'s skin`)
                  .setDescription(
                    `${username} does not have a skin. In the mean time, enjoy Imabanana80's skin`
                  )
                  .setImage(
                    `https://visage.surgeplay.com/full/c4b04ee5c09041f2b34e8e302c626d67`
                  )
                  .setColor(0xfaff86)
                  .setFooter({ text: `${uuid}` });
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
