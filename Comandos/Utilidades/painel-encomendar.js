const Discord = require("discord.js")
const config = require('../../config.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "painel_encomendar", 
  description: "🦺 [ADM] Painel de Encomendar", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_painel",
        description: "Canal para enviar o painel para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_encomendar",
        description: "Canal para enviar as avaliações dos formulários recebidos.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        const canal_painel = interaction.options.getChannel("canal_painel")
        const canal_encomendar = interaction.options.getChannel("canal_encomendar")

        if (canal_painel.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_painel} não é um canal de texto.`, ephemeral: true })
        } else if (canal_encomendar.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_encomendar} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_painel_${interaction.guild.id}`, canal_painel.id)
            await db.set(`canal_encomendar_${interaction.guild.id}`, canal_encomendar.id)

            let embed = new Discord.EmbedBuilder()
            .setDescription(config.embeds_color.embed_invisible)
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal do Painel: ${canal_painel}.\n> Canal das Encomendas: ${canal_encomendar}.`)

            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                let embed_painel = new Discord.EmbedBuilder()
                .setColor(config.embeds_color.embed_invisible)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle(`__Veja Como Encomendar Produtos na Nossa Loja.__`)
                .setDescription(`- | Clique no botão abaixo e siga as instruções.\n\n- | O fato de encomendar o produto não garante que vamos conseguir o seu produto.\n\n- | Caso seja aprovado será notificado, não fique perguntando sobre.\n\n- | Prazo de 3 dias para a entrega da encomenda.`)

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("painel_encomendar")
                    .setEmoji("<:Caixote:1112062552294305842>")
                    .setLabel("Encomende Aqui.")
                    .setStyle(Discord.ButtonStyle.Secondary)
                );

                canal_painel.send({ embeds: [embed_painel], components: [botao] })
            })
        } 
    }
  }
}