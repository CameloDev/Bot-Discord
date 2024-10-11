const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "formulário", 
  description: "🦺 [ADM] Painel Formulario para Staff", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_formulário",
        description: "Canal para enviar o formulário para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_logs",
        description: "Canal para enviar as logs dos formulários recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const canal_formulario = interaction.options.getChannel("canal_formulário")
        const canal_logs = interaction.options.getChannel("canal_logs")

        if (canal_formulario.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_formulario} não é um canal de texto.`, ephemeral: true })
        } else if (canal_logs.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_logs} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_formulario_${interaction.guild.id}`, canal_formulario.id)
            await db.set(`canal_logs_${interaction.guild.id}`, canal_logs.id)

            let embed = new Discord.EmbedBuilder()
            .setDescription("Random")
            .setColor('303136')
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal do Formulário: ${canal_formulario}.\n> Canal de Logs: ${canal_logs}.`)

            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                let embed_formulario = new Discord.EmbedBuilder()
                .setColor("303136")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`__Formulário Staff - Here Store__`)
                .setDescription("- Seja Sincero e escreva com suas Palavras.\n\n- Proibido respostas de Internet / Pesquisa\n\n- Tenha Paciência e não fique nos perguntando sobre após fazer o formulário.")

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("formulario")
                    .setEmoji("<:form:1125526621118533774>")
                    .setDisabled(false)
                    .setLabel("Enviar Formulário")
                    .setStyle(Discord.ButtonStyle.Secondary)
                );

                canal_formulario.send({ embeds: [embed_formulario], components: [botao] })
            })
        } 
    }
  }
}