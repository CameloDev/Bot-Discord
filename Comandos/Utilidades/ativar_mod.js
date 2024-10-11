const {ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require("discord.js")
const {JsonDatabase} = require("wio.db")
const db = new JsonDatabase({databasePath:"./json/system.json"})


module.exports = {
  name: "ativar", 
  description: "[🦺] Moderação | Ativar o automod",
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
            .setTitle(`Sistema está: ${await db.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
            .setDescription(`🔞** | Palavras Feias: ${await db.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
        ],
        ephemeral:true,
        components:[
            new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId("ativaction")
                .addOptions(
                    {
                        label:"Sistemas ON/OFF",
                        value:"system_on_off"
                    },
                    {
                        label:"Palavras ON/OFF",
                        value:"palavras_on_off"
                    },
                    {
                        label:"Link's ON/OFF",
                        value:"links_on_off"
                    },
                    {
                        label:"Ant - Alt ON/OFF",
                        value:"alt_on_off"
                    },
                    {
                        label:"Ant - Ping ON/OFF",
                        value:"ping_on_off"
                    },
                )
            )
        ]
    })
}}