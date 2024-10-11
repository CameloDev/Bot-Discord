const Discord = require("discord.js")
const config = require("../../config.json")
const { QuickDB } = require('quick.db');
const db2 = new QuickDB({ table: "botconfig" });

module.exports = {
  name: "painel-avaliar-staff", 
  description: "Abra o painel de avaliação staff", 
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const thumbnail = await db2.get(`thumbnail_ticket_${interaction.guild.id}`)
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
    } else {
        interaction.reply({content:"painel enviado com sucesso", ephemeral:true})
        interaction.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Blue")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`Avalie nossa equipe Staff!`)
                    .setImage(thumbnail)
            ],
            components:[
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("avaliar_staff")
                    .setLabel("Avalie algum Staff")
                    .setStyle(1)
                )
            ]
        })
    }

  }
}