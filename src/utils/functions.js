const { EmbedBuilder, WebhookClient } = require("discord.js");

async function errorMessage(interaction, err) {
  const codeBlock = "```";
  const cb = "``";
  const errembed = new EmbedBuilder()
    .setTitle(
      `An error occured whilst trying to run ${`${interaction}`.split(" ")[0]}`
    )
    .setColor("Red")
    .setDescription(`${codeBlock}err\n${err}${codeBlock}`)
    .addFields({
      name: "If this problem persists,",
      value:
        "[Click here to contact the developers!](https://discord.gg/5GxWqAEdez)",
      inline: true,
    })
    .addFields({
      name: "Support ID (keep this!)",
      value: `${cb}${interaction.id}${cb}`,
      inline: true,
    });
  const embed = new EmbedBuilder()
    .setTitle(`An error occured in ${interaction.guild.name}`)
    .setColor("Red")
    .setDescription(`${codeBlock}err\n${err.stack || err}${codeBlock}`)
    .addFields(
      { name: "Full Command", value: `${codeBlock}${interaction}${codeBlock}` },
      { name: `Triggered by`, value: `${interaction.user}`, inline: true },
      {
        name: "Support ID",
        value: `${cb}${interaction.id}${cb}`,
        inline: true,
      }
    );
  const webhookclient = new WebhookClient({ url: process.env.ERRWEBHOOK });
  let messageid = "";
  await webhookclient
    .send({
      content: `<@${process.env.OWNERID}>`,
      embeds: [embed],
      files: ["./src/console.txt"],
    })
    .then((message) => {
      messageid = message.id;
      console.log(message);
      message.react(`🟢`);
    });
  webhookclient.editMessage(messageid, {
    content: ``,
  });
  await interaction.editReply({
    embeds: [errembed],
  });
  console.log(`[Error] ${err}`);
  return;
}

async function noPerms(interaction, permission) {
  const noPermsEmbed = new EmbedBuilder()
    .setTitle("Insufficient permissions!")
    .setColor("Red")
    .setDescription(
      `You dont have the required permission(s) \`\`${permission}\`\``
    );
  await interaction.editReply({ embeds: [noPermsEmbed] });
}

module.exports = {
  errorMessage,
  noPerms,
};
