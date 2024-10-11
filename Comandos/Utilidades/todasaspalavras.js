const {ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js")
const {JsonDatabase} = require("wio.db")
const db = new JsonDatabase({databasePath:"./json/palavras_feias.json"})
const db1 = new JsonDatabase({databasePath:"./json/linksblock.json"})


module.exports = {
  name: "ver-tudo", 
  description: "[🦺] Moderação",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        return;
    }


    interaction.reply({
        embeds:[
            new EmbedBuilder()
            .setDescription(`Palavras: ${await db.get(`palavras`)} \n\n Links: ${await db1.get(`links`)} ` )
        ]
    })
}}