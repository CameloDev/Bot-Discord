const {ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js")
const {JsonDatabase} = require("wio.db")
const db = new JsonDatabase({databasePath:"./json/system.json"})
const palavras = new JsonDatabase({databasePath:"./json/palavras_feias.json"})
const linksblock = new JsonDatabase({databasePath:"./json/linksblock.json"})


module.exports = {
  name: "gerenciarmod", 
  description: "[🦺] Moderação | Gerencie o automod",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        return;
    }


    interaction.reply({
        content:`${interaction.user}`,
        embeds:[
            new EmbedBuilder()
            .setTitle(`${interaction.client.user.username} | Gerenciar AutoMod`)
            .setDescription(`*\`Gerencie o sistema de auto moderação!\`* \n\n⛔ **| Bloqueie palavras indesejadas!** \n⚠ **| Remova Links ** \n✔ **| Sistema ant-Alts ** `)
        ],
        ephemeral:true,
        components:[
            new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("gerenciar_select")
                .setPlaceholder("Escolha alguma das opções!")
                .setMaxValues(1)
                .addOptions(
                    {
                        label:"Canal Staff",
                        description:"Altere o canal de logs!",
                        value:"channel_logs",
                        emoji:"📣"
                    },
                    {
                        label:"Bloquear Palavras",
                        description:"Bloqueie palavras especificas!",
                        value:"palavras_block",
                        emoji:"⛔"
                    },
                    {
                        label:"Remove Links",
                        description:"Bloqueie qualquer tipo de link!",
                        value:"links_remove",
                        emoji:"⚠"
                    },
                    {
                        label:"Ant-Alts",
                        description:"Evite que usem alts em seu servidor!",
                        value:"ant_alts",
                        emoji:"✔"
                    },
                    {
                        label:"Debug",
                        value:"debug",
                    },
                )
            )
        ]
    })
}}