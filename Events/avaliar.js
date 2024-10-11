const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
const config = require("../config.json")
const { JsonDatabase} = require("wio.db")
const db = new JsonDatabase({databasePath: "./config.json"})
module.exports = {
    name:"avaliar",
    async execute (interaction, client) {

        if(interaction.customId === "avaliar_staff") {
            const modal = new ModalBuilder()
            .setCustomId("modal_avaliar_staffs")
            .setTitle("Avalie algum staff!")

            const text = new TextInputBuilder()
            .setCustomId("nota")
            .setLabel("Qual é a Nota?")
            .setPlaceholder("de 1 a 10")
            .setRequired(true)
            .setStyle(1)
            .setValue("10")
            .setMaxLength(2)

            const consid = new TextInputBuilder()
            .setCustomId("consideraction")
            .setLabel("Considerações finais?")
            .setValue("Gostei muito do atendimento, rapido e respondeu tudo certo!")
            .setStyle(2)
            .setRequired(true)

            const id = new TextInputBuilder()
            .setCustomId("id")
            .setLabel("Qual é o id do staff?")
            .setStyle(1)
            .setRequired(true)

            modal.addComponents(new ActionRowBuilder().addComponents(text))
            modal.addComponents(new ActionRowBuilder().addComponents(id))
            modal.addComponents(new ActionRowBuilder().addComponents(consid))
            return interaction.showModal(modal)
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_avaliar_staffs") {
            const nota = interaction.fields.getTextInputValue("nota")
            const consid  = interaction.fields.getTextInputValue("consideraction")
            const staff  = interaction.fields.getTextInputValue("id")
            const staffs = interaction.guild.members.cache.get(staff)
            const channel = interaction.guild.channels.cache.get(await db.get(`avaliar_staff`))
            if(!staffs) {
                interaction.reply({
                    content:"O usuario não está no servidor!",
                    ephemeral:true
                })
                return;
            }


            const data24 = Math.floor(+new Date() / 1000);
            const data_compra = `<t:${data24}:f>`;
            const passado_compra = `<t:${data24}:R>`;

            switch (nota) {
                case "1": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`1/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "2": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`2/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "3": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`3/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "4": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`4/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "5": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`5/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "6": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`6/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "7": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`7/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;


                    
                case "8": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`8/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;



                    
                case "9": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`9/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;




                    
                case "10": {
                    const embed = new EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setTitle("💓 | Nova Avaliação")
                    .addFields(
                      {
                        name: `👥 | Avaliação Enviada Por:`,
                        value: ` ${interaction.user}`,
                        inline: false
                      },
                      {
                        name: `✨ | Staff Avaliado`,
                        value: `${staffs}`,
                        inline: false
                      },
                      {
                        name: `💓 | Nota da avaliação:`,
                        value: `\`10/10\``,
                        inline: false
                      },
                      {
                        name: `🎃 | Considerações Finais:`,
                        value: `${consid}`,
                        inline: false
                      },
                      {
                        name: `📅 | Data/Horário:`,
                        value: `${data_compra} (${passado_compra})`,
                        inline: false
                      },
                    );
                
                    interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
                    channel.send({embeds:[embed]})
                } 
                    
                    break;
            
                default: {
                    interaction.reply({
                        content:"escolha de 1 a 10",
                        ephemeral:true
                    })
                }
                    break;
            }
        }
    }}