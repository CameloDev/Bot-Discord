const Discord = require("discord.js");
const config = require('../../config.json');
const { ButtonBuilder } = require("discord.js");

module.exports = {
    name: "anunciar",
    description: "Faça um anuncio",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Qual canal será enviado?",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: "Você não possui permissão para utilizar este comando!", ephemeral: true });
            return;
        } 

        const channel = interaction.options.getChannel("canal")

    
        interaction.reply({
            embeds:[
                new Discord.EmbedBuilder()
                .setTitle(`Configure abaixo os campos da embed que deseja configurar.`)
                .setFooter({text:"Clique em cancelar para cancelar o anúncio."})
            ],
            components:[
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("titulo_anuncio")
                    .setLabel("⠀Titulo")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("desc_anuncio")
                    .setLabel("Descrição")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("imagem_anuncio")
                    .setLabel("Imagem")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("miniatura_anuncio")
                    .setLabel("Miniatura")
                    .setStyle(2),
                ),
                
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("author_anuncio")
                    .setLabel("⠀Author⠀")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("rodape_anuncio")
                    .setLabel("⠀Rodapé⠀")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("data_anuncio")
                    .setLabel("⠀Data⠀")
                    .setStyle(2),
                    new Discord.ButtonBuilder()
                    .setCustomId("cor_anuncio")
                    .setLabel("⠀Cor⠀")
                    .setStyle(2),
                ),
                
                
                new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId("cancelar_anuncio")
                    .setLabel("Cancelar")
                    .setStyle(4),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${channel.id}_enviar_anuncio`)
                    .setLabel(`⠀⠀⠀⠀⠀⠀Enviar⠀⠀⠀⠀⠀⠀`)
                    .setStyle(3),
                    new Discord.ButtonBuilder()
                    .setCustomId("preview_anuncio")
                    .setLabel("Preview")
                    .setStyle(1)
                )
            ]
        })



    }
}
