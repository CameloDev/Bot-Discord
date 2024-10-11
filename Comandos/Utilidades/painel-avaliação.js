const Discord = require("discord.js")
const config = require('../../config.json')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
  name: "painel_avaliação", 
  description: "🦺 [ADM] Painel de Avaliação", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "canal_painel",
        description: "Canal para enviar o painel para os membros.",
        type: Discord.ApplicationCommandOptionType.Channel,
        required: true,
    },
    {
        name: "canal_avaliação",
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
        const canal_avaliação = interaction.options.getChannel("canal_avaliação")

        if (canal_painel.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_painel} não é um canal de texto.`, ephemeral: true })
        } else if (canal_avaliação.type !== Discord.ChannelType.GuildText) {
            interaction.reply({ content: `O canal ${canal_avaliação} não é um canal de texto.`, ephemeral: true })
        } else {
            await db.set(`canal_painel_${interaction.guild.id}`, canal_painel.id)
            await db.set(`canal_avaliação_${interaction.guild.id}`, canal_avaliação.id)

            let embed = new Discord.EmbedBuilder()
            .setDescription(config.embeds_color.embed_invisible)
            .setTitle("Canais Configurados!")
            .setDescription(`> Canal do Painel: ${canal_painel}.\n> Canal das Avaliações: ${canal_avaliação}.`)

            interaction.reply({ embeds: [embed], ephemeral: true }).then( () => {
                let embed_painel = new Discord.EmbedBuilder()
                .setColor(config.embeds_color.embed_invisible)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle(`Deixe seu feedback no botão abaixo.`)
                .setDescription(`- Clique no **botão** abaixo e siga as instruções.\n\n- Não escreva palavras inapropriadas, caso contrario terá consequências!\n\n- Seja Sincero na sua avaliação.
`)
                 .setImage(config.client.imagem);

                let botao = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("painel_avaliação")
                    .setEmoji("1103530828308414475")
                    .setLabel("Avalie Aqui")
                    .setStyle(Discord.ButtonStyle.Secondary)
                );

                canal_painel.send({ embeds: [embed_painel], components: [botao] })
            })
        } 
    }
  }
}

