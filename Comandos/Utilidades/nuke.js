const Discord = require("discord.js")

module.exports = {
  name: "nuke",
  description: "Apague e crie um novo canal",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "channel",
        description: "Qual será o canal que ira ser nukado?",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: false,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        return;
    } 

    const channel = interaction.options.getChannel("channel") || interaction.channel
    
    channel.clone().then((chan) => {
        channel.delete()
        chan.send(`Canal nukado por \`${interaction.user.username}\``)
    })

  }
}