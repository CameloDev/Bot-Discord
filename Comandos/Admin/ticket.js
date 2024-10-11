const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { JsonDatabase} = require("wio.db");
const db = new JsonDatabase({ databasePath:"./json/geral.json" });


module.exports = {
    name:"ticket",
    description:"Execute enviar a mensagem do ticket.",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction ) => {

		const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole) {
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }
		
        const embed = new EmbedBuilder().setDescription(`${db.get(`embeds.desc`)}`).setFooter({text:`${db.get(`embeds.footer`)}`}).setColor(`${db.get(`embeds.cor`)}`)
        
        if(db.get(`embeds.titulo`) !== "remover") {
            embed.setTitle(`${db.get(`embeds.titulo`)}`)
        }
                
        if(db.get(`embeds.banner`) !== "remover") {
            embed.setImage(`${db.get(`embeds.banner`)}`)
        }
                
        if(db.get(`embeds.imagem`) !== "remover") {
            embed.setThumbnail(`${db.get(`embeds.imagem`)}`)
        }
        
        interaction.channel.send({
            embeds:[
                embed
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("abrir_ticket")
                    .setStyle(2)
                    .setLabel(`${db.get(`embeds.button.text`)}`)
                    .setEmoji(`${db.get(`embeds.button.emoji`)}`)
                )
            ]
        }).then(() => {
            interaction.reply({embeds:[
                new EmbedBuilder()
                .setDescription(`✅ | Sucesso ${interaction.user}, Seu Ticket já foi enviado no chat!`)
                .setColor("Green")
            ], ephemeral:true})
        })
    }
}