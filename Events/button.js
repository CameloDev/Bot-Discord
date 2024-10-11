
const { EmbedBuilder, ChannelSelectMenuBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, ChannelType, WebhookClient} = require("discord.js");
const { JsonDatabase} = require("wio.db");
const db = new JsonDatabase({ databasePath:"./json/geral.json"})
const db2 = new JsonDatabase({ databasePath:"./json/ass.json"})
const db3 = new JsonDatabase({ databasePath:"./json/vazio.json"})
const db4 = new JsonDatabase({ databasePath:"./json/logs.json"})
const { QuickDB } = require("quick.db")
const db1 = new QuickDB()

module.exports = {
  name: "ticket",
  async execute(interaction, message) {

    if(interaction.customId === "assumir_ticket") {
        const ticket = await db1.get(`${interaction.channel.id}`);
        const user = interaction.guild.members.cache.get(ticket.owner);
        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole) {
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }

        user.send({
            embeds:[
                new EmbedBuilder()
                .setDescription(`***${user.displayName}** O seu **TICKET** foi assumido, clique no **BOTÃO** para ir ao **TICKET***`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(5)
                    .setLabel("Ir para o Ticket")
                    .setURL(interaction.channel.url)
                )
            ]
        }).catch(() => {console.log("Usuario está com o privado bloqueado")});
        const cau = interaction.guild.channels.cache.find(a => a.name === `📞・${user.user.username}`);
       await interaction.update({
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("sair_ticket")
                    .setLabel("Sair do ticket")
                    .setStyle(1)
                    
                    .setEmoji(`${db.get(`emojis.sair`)}`),
                    new ButtonBuilder()
                    .setCustomId("assumir_ticket")
                    .setDisabled(true)
                    .setLabel("Este Ticket ja esta assumido")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.assumir`)}`),
                    new ButtonBuilder()
                    .setCustomId("renomear_ticket")
                    .setLabel("Renomear Sala")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.renomear`)}`),
                    new ButtonBuilder()
                    .setCustomId("notify_member")
                    .setLabel("Notificar Membro")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.notify_member`)}`),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("addmember")
                    .setLabel("Adicionar Membro")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.addmember`)}`),
                    new ButtonBuilder()
                    .setCustomId("removemember")
                    .setLabel("Remover Membro")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.removemember`)}`),
                    new ButtonBuilder()
                    .setCustomId(cau ? "delete_call" : "create_call")
                    .setLabel(cau ? "Deletar Call" : "Criar Call")
                    .setStyle(2)
                    
                    .setEmoji(`${db.get(`emojis.criarcall`)}`),
                    new ButtonBuilder()
                    .setCustomId("fechar_ticket")
                    .setLabel("Fechar Ticket")
                    .setStyle(4)
                    
                    .setEmoji(`${db.get(`emojis.fechar`)}`),
                )
            ]
        });
        db2.add(`${interaction.user.id}`, 1);
        db1.set(`${interaction.channel.id}.ass`, interaction.user.id);
    }
    if(interaction.customId === "create_call") {

        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
        const ticket = await db1.get(`${interaction.channel.id}`);
        const user = interaction.guild.members.cache.get(ticket.owner);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole) {
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }
        
        const cau = interaction.guild.channels.cache.find(a => a.name === `📞・${user.user.username}`);
        if(cau) {
            await interaction.update({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("sair_ticket")
                        .setLabel("Sair do ticket")
                        .setStyle(1)
                        .setEmoji(`${db.get(`emojis.sair`)}`),
                        new ButtonBuilder()
                        .setCustomId("assumir_ticket")
                        .setLabel(ticket.ass === "Ninguem Assumiu" ? "Assumir Ticket" : "Ticket foi assumido")
                        .setStyle(2)
                        .setDisabled(ticket.ass === "Ninguem Assumiu" ? false : true)
                        .setEmoji(`${db.get(`emojis.assumir`)}`),
                        new ButtonBuilder()
                        .setCustomId("renomear_ticket")
                        .setLabel("Renomear Sala")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.renomear`)}`),
                        new ButtonBuilder()
                        .setCustomId("notify_member")
                        .setLabel("Notificar Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.notify_member`)}`),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("addmember")
                        .setLabel("Adicionar Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.addmember`)}`),
                        new ButtonBuilder()
                        .setCustomId("removemember")
                        .setLabel("Remover Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.removemember`)}`),
                        new ButtonBuilder()
                        .setCustomId(cau ? "delete_call" : "create_call")
                        .setLabel(cau ? "Deletar Call" : "Criar Call")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.criarcall`)}`),
                        new ButtonBuilder()
                        .setCustomId("fechar_ticket")
                        .setLabel("Fechar Ticket")
                        .setStyle(4)
                        .setEmoji(`${db.get(`emojis.fechar`)}`),
                    )
                ]
            });
            interaction.followUp({content:`❌ | A Call já esta Criada!\n🔎 | Call: ${cau.url}`, ephemeral:true});
            return;
        }

        const permissionOverwrites = [
            {
                id: user.id,
                allow:["SendMessages", "ViewChannel"]
            },
            {
                id:interaction.guild.id,
                deny:["ViewChannel", "SendMessages"]
            }
        ]
        db.get(`roles`).map((rls) => {
            const role = interaction.guild.roles.cache.get(db.get("roles"))
            if(role) {
                permissionOverwrites.push({
                    id: rls,
                    allow:["ViewChannel", "SendMessages"],
                })
            }
        });
        await interaction.reply({content:`🔁 | Aguarde um momento estou criando seu Canal...`, ephemeral:true});
        const channel = await interaction.guild.channels.create({
            name: `📞・${user.user.username}`,
            type: 2,
            parent: interaction.channel.parent,
            permissionOverwrites: permissionOverwrites
        });
        interaction.editReply({content:`✅ | Criada com sucesso!\n🔎 | Call: ${channel.url}`});
        
    }
    if(interaction.isButton() && interaction.customId === "delete_call") {
        const ticket = await db1.get(`${interaction.channel.id}`);
        const user = interaction.guild.members.cache.get(ticket.owner);
        
        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole) {
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }
        
        const cau = interaction.guild.channels.cache.find(a => a.name === `📞・${user.user.username}`);
        if(!cau) {
            await interaction.update({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("sair_ticket")
                        .setLabel("Sair do ticket")
                        .setStyle(1)
                        .setEmoji(`${db.get(`emojis.sair`)}`),
                        new ButtonBuilder()
                        .setCustomId("assumir_ticket")
                        .setLabel(ticket.ass === "Ninguem Assumiu" ? "Assumir Ticket" : "Ticket foi assumido")
                        .setStyle(2)
                        .setDisabled(ticket.ass === "Ninguem Assumiu" ? false : true)
                        .setEmoji(`${db.get(`emojis.assumir`)}`),
                        new ButtonBuilder()
                        .setCustomId("renomear_ticket")
                        .setLabel("Renomear Sala")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.renomear`)}`),
                        new ButtonBuilder()
                        .setCustomId("notify_member")
                        .setLabel("Notificar Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.notify_member`)}`),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("addmember")
                        .setLabel("Adicionar Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.addmember`)}`),
                        new ButtonBuilder()
                        .setCustomId("removemember")
                        .setLabel("Remover Membro")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.removemember`)}`),
                        new ButtonBuilder()
                        .setCustomId(cau ? "delete_call" : "create_call")
                        .setLabel(cau ? "Deletar Call" : "Criar Call")
                        .setStyle(2)
                        .setEmoji(`${db.get(`emojis.criarcall`)}`),
                        new ButtonBuilder()
                        .setCustomId("fechar_ticket")
                        .setLabel("Fechar Ticket")
                        .setStyle(4)
                        .setEmoji(`${db.get(`emojis.fechar`)}`),
                    )
                ]
            });
            interaction.followUp({content:`❌ | Não foi encontrado nenhum canal!`, ephemeral:true});
            return;
        }

        await interaction.reply({content:`🔁 | Aguarde um momento estou Deletando seu Canal...`, ephemeral:true});
        await cau.delete();
        interaction.editReply({content:`✅ | Deletada com sucesso!`});
    }

    if(interaction.isButton() && interaction.customId === "sair_ticket") {
        const ticket = await db1.get(`${interaction.channel.id}`);
        const user = interaction.guild.members.cache.get(ticket.owner);

        if(interaction.user.id !== user.id) {
            interaction.reply({
                content:`Apenas o Usuario: ${user} pode sair do ticket!`,
                ephemeral:true
            });
            return;
        }
        await interaction.channel.permissionOverwrites.edit(user,{
            ViewChannel: false,
            SendMessages: false
          });
          const cau = interaction.guild.channels.cache.find(a => a.name === `📞・${user.user.username}`);
          if(cau) {
            cau.delete();
          }
       await interaction.update({
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("sair_ticket")
                    .setLabel("Sair do ticket")
                    .setStyle(1)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.sair`)}`),
                    new ButtonBuilder()
                    .setCustomId("assumir_ticket")
                    .setLabel("Este Ticket ja esta assumido")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.assumir`)}`),
                    new ButtonBuilder()
                    .setCustomId("renomear_ticket")
                    .setLabel("Renomear Sala")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.renomear`)}`),
                    new ButtonBuilder()
                    .setCustomId("notify_member")
                    .setLabel("Notificar Membro")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.notify_member`)}`),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("addmember")
                    .setLabel("Adicionar Membro")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.addmember`)}`),
                    new ButtonBuilder()
                    .setCustomId("removemember")
                    .setLabel("Remover Membro")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.removemember`)}`),
                    new ButtonBuilder()
                    .setCustomId(cau ? "delete_call" : "create_call")
                    .setLabel(cau ? "Deletar Call" : "Criar Call")
                    .setStyle(2)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.criarcall`)}`),
                    new ButtonBuilder()
                    .setCustomId("fechar_ticket")
                    .setLabel("Fechar Ticket")
                    .setStyle(4)
                    .setDisabled(true)
                    .setEmoji(`${db.get(`emojis.fechar`)}`),
                )
            ]
        });
        interaction.followUp({
            embeds:[
                new EmbedBuilder()
                .setDescription(`*${interaction.user.displayName} finalizou o seu **ATENDIMENTO** após clicar para sair do ticket*`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("fechar_ticket")
                    .setLabel("Deletar Ticket")
                    .setStyle(2)
                    .setEmoji("🗑"),
                    new ButtonBuilder()
                    .setCustomId("salv_msg")
                    .setLabel("Salvar Mensagens")
                    .setStyle(2)
                    .setEmoji("📁")
                )
            ]
        })

    }

    if(interaction.isButton() && interaction.customId === "salv_msg") {
       await  interaction.update({
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("fechar_ticket")
                    .setLabel("Deletar Ticket")
                    .setStyle(2)
                    
                    .setEmoji("🗑"),
                    new ButtonBuilder()
                    .setCustomId("salv_msg")
                    .setLabel("Salvar Mensagens")
                    
                    .setStyle(2)
                    .setEmoji("📁")
                )
            ]
        });
        interaction.followUp({
            embeds:[
                new EmbedBuilder()
                .setDescription(`📨 *Salvando mensagens e deletando canal*`)
            ]
        });
        const sourceChannel = interaction.channel;
        
        const lastMessage = sourceChannel.messages.cache.last();
        sourceChannel.messages.fetch({ before: lastMessage.id }).then(messages => {
  
          const messagesArray = Array.from(messages.values());
          
          for(let i = messagesArray.length - 1; i >= 0; i--) {
            const msg = messagesArray[i];
          db3.push(`${idgerado}_asd`, {
            username: msg.author.displayName,
            avatarURL: msg.author.displayAvatarURL(),
            content:`<t:${Math.floor(msg.createdTimestamp / 1000)}:f>: ${msg.content}`
          });
        }
      });
      const ticket = await db1.get(`${interaction.channel.id}`);
      const user = interaction.guild.members.cache.get(ticket.owner);
      const canal_logs = interaction.guild.channels.cache.get(db.get(`channel_logs`))
      const idgerado = ticket.id;
      const ass = interaction.guild.members.cache.get(`${ticket.ass}`) || "`Ninguem Assumiu`"
      const quantidadeAssumido = await db2.get(`${ass.id}`) || "0"
      const newUserLog = {
          dono_ticket: user.id,
          fechou_ticket: interaction.user.id,
          assumido: ass ?? 'Ninguem assumiu',
          motivo: ticket.motivo,
          tipo: ticket.tipo,
          codigo: ticket.id
        };
        db4.push(`${interaction.user.id}`, newUserLog);
                        setTimeout(() => {
                            interaction.channel.delete()
                            db.delete(`${interaction.channel.id}`)
                        }, 3500);

                        if(user) {
                            user.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`${user.user.username} O seu TICKET foi finalizado!`)
                                    .setDescription(`Id do **TICKET**: ${idgerado}\n\n*Clique no* ***MENU*** *abaixo para dizer como foi seu atendimento.*`)
                                    .setColor("#2b2d31")
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                          .setCustomId("painel_avaliation")
                                          .setPlaceholder("De o seu feedback!")
                                          .addOptions(
                                            {
                                              label: "Ruim",
                                              description:"Caso seu atendimento não foi como esperado.",
                                              value: `${idgerado}_ruim`,
                                              emoji: "☹"
                                            },
                                            {
                                                label: "Regular",
                                                description:"Caso seu atendimento não foi ruim mas pode melhorar.",
                                                value: `${idgerado}_regular`,
                                                emoji: "😐"
                                              },
                                              {
                                                label: "Bom",
                                                description:"Caso o atendimento atende suas expectativas.",
                                                value: `${idgerado}_bom`,
                                                emoji: "😀"
                                              },
                                          )
                                      ),
                                ]
                            });
                        }

                        if(canal_logs) {
                            canal_logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`📄 \`Log de Atendimento\``)
                                    .addFields(
                                      {
                                        name:`⛔ Ticket Fechado por:`,
                                        value: `${interaction.user}`,
                                        inline: true
                                      },
                                      {
                                        name:`✅ Ticket Aberto por:`,
                                        value: `${user.user}`,
                                        inline: true
                                      },
                                      {
                                        name:`👤 Ticket Assumido por:`,
                                        value: `${ass}`,
                                        inline: true
                                      },            
                                      {
                                        name:`🌐 Quantidade assumido`,
                                        value: `${quantidadeAssumido}`,
                                        inline: true
                                      },
                                      {
                                        name:`🆔 ID do Ticket`,
                                        value: `*\`${idgerado}\`*`,
                                        inline: true
                                      },
                                      {
                                        name:`💡 Fechado`,
                                        value: `<t:${Math.round(new Date().getTime() / 1000)}:f> (<t:${Math.round(new Date().getTime() / 1000)}:R>)`,
                                        inline: true
                                      },
                                    )
                                ],
                                components: [
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${idgerado}_slv`)
                                        .setLabel("Carregar Transcript")
                                        .setStyle(3)
                                        .setEmoji(`📑`),
                                        new ButtonBuilder()
                                        .setCustomId(`${user.id}_historico`)
                                        .setLabel("Histórico do membro")
                                        .setStyle(2)
                                        .setEmoji(`<:User:1181014051220901939>`),
                                    )
                                ]
                            })
                        }
        
    }
    if(interaction.isButton()) {
        const customId = `${interaction.customId}`;
        if(customId.endsWith("_slv")) {
            const id = customId.split("_")[0];
            interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`*🔄 O Transcript está sendo carregado, aguarde alguns segundos.*`)
                ],
                ephemeral:true
            })
			
            interaction.guild.channels.create({
                name:`📑・transcript-${id}`,
                parent: interaction.channel.parent,
				permissionOverwrites:[
                {
                    id: interaction.user.id,
                    allow:["ViewChannel", "SendMessages"],
                },
                {
                    id:interaction.guild.id,
                    deny:["ViewChannel", "SendMessages"]
                }
            ],
              }).then(async (channel) => {
                await channel.send({
                    embeds:[
                        new EmbedBuilder()
                        .setTitle(`${interaction.guild.name} | \`LOGS TRANSCRIPT\``)
                        .setDescription(`- *Para analisar com mais precisão passe o mouse em cima da data para verificar o horário das mensagens*\n- *Para Finalizar este canal clique no botão no final das mensagens* \n\n *Id do transcript: \`${id}\` *`)
                    ]
                })
                const webhook = channel.createWebhook({
                  name: interaction.user.displayName,
                }).then(async(webhook) => {
                    const webhookClient = new WebhookClient({ url: webhook.url });
            
            
                    const messagesArray = await db3.get(`${id}_asd`);
        
for (let i = 0; i < messagesArray?.length; i++) {
    const msg = messagesArray[i];
    await webhookClient.send({
        username: msg.username, 
        avatarURL: msg.avatarURL,
        content: msg.content
    });
}
                      interaction.editReply({
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`*O transcript de id \`${id}\` foi carregado com sucesso no ${channel.url}*`)
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel("Ir até o transcript")
                                .setStyle(5)
                                .setURL(channel.url)
                            )
                        ]
                      });
                      channel.send({
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(`\`📑 TRANSCRIPT FINALIZADO\``)
                            .setDescription(`*Para finalizar o canal clique no **BOTÃO** abaixo*`)
                        ],
                        components:[
                            new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(4)
                                .setEmoji("🗑")
                                .setCustomId("apagar_transcript")
                            )
                        ]
                      })
                })
              })
        }
    }
    if(interaction.isButton() && interaction.customId === "apagar_transcript") {
        interaction.channel.delete();
    }

    if(interaction.customId === "notify_member") {
        const ticket = await db1.get(`${interaction.channel.id}`);
        const user = interaction.guild.members.cache.get(ticket.owner);
        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole) {
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }

        user.send({
            embeds:[
                new EmbedBuilder()
                .setDescription(`***${user.displayName}** Um dos Staff está lhe chamando, para ir no **TICKET** Clique no **BOTÃO** abaixo!*`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(5)
                    .setLabel("Ir para o Ticket")
                    .setURL(interaction.channel.url)
                )
            ]
        }).then(() => {
            interaction.reply({
                content:"✅ | Usuario notificado com sucesso!",
                ephemeral:true
            })
        }).catch(() => {
            interaction.reply({
                content:"⛔ | Usuario está com o privado bloqueado!",
                ephemeral:true
            })
        })

    }
        if(interaction.customId === "renomear_ticket") {
            const ticket = await db1.get(`${interaction.channel.id}`);
            const user = interaction.guild.members.cache.get(ticket.owner);
            const user1 = interaction.guild.members.cache.get(interaction.user.id);
            const roleIdToCheck = db.get(`roles`);
          
            const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
          
            if (!hasRequiredRole) {
              await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
              return;
            }

            const modal = new ModalBuilder()
            .setCustomId("renomear_channel")
            .setTitle("💢 - Renomear Sala");
            
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("QUAL VAI SER O NOME DO TICKET?")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder("Coloque o nome que irá ser trocado");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal)
        }

        if(interaction.isModalSubmit() && interaction.customId === "renomear_channel") {
            await interaction.channel.edit({
                name:`${interaction.fields.getTextInputValue("text")}`
            })
            interaction.reply({
                content:"Canal Renomeado com sucesso!",
                ephemeral:true
            })
        }

            if(interaction.customId === "addmember") {
                const ticket = await db1.get(`${interaction.channel.id}`);
                const user = interaction.guild.members.cache.get(ticket.owner);
                const user1 = interaction.guild.members.cache.get(interaction.user.id);
                const roleIdToCheck = db.get(`roles`);
              
                const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
              
                if (!hasRequiredRole) {
                  await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
                  return;
                }
                const modal = new ModalBuilder()
                .setCustomId("addmember_modal")
                .setTitle("💢 - Adicionar Membro");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("Qual é o ID do usuario?")
                .setStyle(1)
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(interaction.isModalSubmit() && interaction.customId === "addmember_modal") {
                const ID = interaction.fields.getTextInputValue("text");
                const user = interaction.guild.members.cache.get(ID);
                const ticket = await db1.get(`${interaction.channel.id}`)
                const use1 = interaction.guild.members.cache.get(ticket.owner)
                if(!user) {
                    interaction.reply({
                        content:"Não existe usuario ou você digitou o ID errado!",
                        ephemeral:true
                    });
                    return;
                }


                if (interaction.channel.permissionsFor(user.id).has("ViewChannel")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`❌ | O usuário ${user}(\`${user.id}\`) já possui acesso ao ticket!`)
                    ],
                    ephemeral: true
                });
        
                await interaction.channel.permissionOverwrites.edit(user.id,{
                    ViewChannel: true,
                    SendMessages: true
                  });
                interaction.reply({
                    content:"Membro Adicionado com sucesso!",
                    ephemeral:true
                })


            }


            if(interaction.customId === "removemember") {
                const ticket = await db1.get(`${interaction.channel.id}`);
                const user = interaction.guild.members.cache.get(ticket.owner);
                const user1 = interaction.guild.members.cache.get(interaction.user.id);
                const roleIdToCheck = db.get(`roles`);
              
                const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
              
                if (!hasRequiredRole) {
                  await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
                  return;
                }
                const modal = new ModalBuilder()
                .setCustomId("removemember_modal")
                .setTitle("💢 - Remover Membro");

                const text = new TextInputBuilder()
                .setCustomId("text")
                .setLabel("Qual é o ID do usuario?")
                .setStyle(1)
                .setRequired(true)

                modal.addComponents(new ActionRowBuilder().addComponents(text));

                return interaction.showModal(modal);
            }
            if(interaction.isModalSubmit() && interaction.customId === "removemember_modal") {
                const ID = interaction.fields.getTextInputValue("text");
                const user = interaction.guild.members.cache.get(ID);
                const ticket = await db1.get(`${interaction.channel.id}`)
                const use1 = interaction.guild.members.cache.get(ticket.owner)
                if(!user) {
                    interaction.reply({
                        content:"Não existe usuario ou você digitou o ID errado!",
                        ephemeral:true
                    });
                    return;
                }


                if (!interaction.channel.permissionsFor(user.id).has("ViewChannel")) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`❌ | O usuário ${user}(\`${user.id}\`) não possui acesso ao ticket!`)
                    ],
                    ephemeral: true
                })

                await interaction.channel.permissionOverwrites.edit(user.id,{
                    ViewChannel: false,
                    SendMessages: false
                  });

                interaction.reply({
                    content:"Membro Removido com sucesso!",
                    ephemeral:true
                })



            }
                    if(interaction.isButton() && interaction.customId === "fechar_ticket") { 

                        const user1 = interaction.guild.members.cache.get(interaction.user.id);
                        const roleIdToCheck = db.get(`roles`);
                      
                        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
                      
                        if (!hasRequiredRole) {
                          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
                          return;
                        }
                        const modalreport = new ModalBuilder()
                        .setCustomId('modal_finalreport') 
                        .setTitle(`⚙ | Fechar Ticket`)
                
                    const titlereport = new TextInputBuilder()
                    .setCustomId('title_report')
                    .setLabel('Motivo:')
                    .setRequired(true)
                    .setMinLength(5)
                    .setMaxLength(150)
                    .setStyle(1)
                
                    modalreport.addComponents(
                        new ActionRowBuilder().addComponents(titlereport),
                    );
                
                    return interaction.showModal(modalreport);

                    }

                    if (interaction.isModalSubmit() && interaction.customId === "modal_finalreport") {
                        interaction.reply({
                            embeds:[
                                new EmbedBuilder()
                                .setDescription(`Este Canal será deletado dentro de alguns segundos...`)
                            ],
                            ephemeral: true
                        })

                        
        const sourceChannel = interaction.channel;
        
        const lastMessage = sourceChannel.messages.cache.last();
        sourceChannel.messages.fetch({ before: lastMessage.id }).then(messages => {
  
          const messagesArray = Array.from(messages.values());
          
          for(let i = messagesArray.length - 1; i >= 0; i--) {
            const msg = messagesArray[i];
          db3.push(`${idgerado}_asd`, {
            username: msg.author.displayName,
            avatarURL: msg.author.displayAvatarURL(),
            content:`<t:${Math.floor(msg.createdTimestamp / 1000)}:f>: ${msg.content}`
          });
        }
      });
      const ticket = await db1.get(`${interaction.channel.id}`);
      const user = interaction.guild.members.cache.get(ticket.owner);
      const canal_logs = interaction.guild.channels.cache.get(db.get(`channel_logs`))
      const idgerado = ticket.id;
      const ass = interaction.guild.members.cache.get(`${ticket.ass}`) || "`Ninguem Assumiu`"
      const quantidadeAssumido = await db2.get(`${ass.id}`) || "0"
      const newUserLog = {
          dono_ticket: user.id,
          fechou_ticket: interaction.user.id,
          assumido: ass ?? 'Ninguem assumiu',
          motivo: ticket.motivo,
          tipo: ticket.tipo,
          codigo: ticket.id
        };
        db4.push(`${interaction.user.id}`, newUserLog);
                        setTimeout(() => {
                            interaction.channel.delete()
                            db.delete(`${interaction.channel.id}`)
                        }, 3500);

                        if(user) {
                            user.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`${user.user.username} O seu TICKET foi finalizado!`)
                                    .setDescription(`Id do **TICKET**: ${idgerado}\n\n*Clique no* ***MENU*** *abaixo para dizer como foi seu atendimento.*`)
                                    .setColor("#2b2d31")
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                          .setCustomId("painel_avaliation")
                                          .setPlaceholder("De o seu feedback!")
                                          .addOptions(
                                            {
                                              label: "Ruim",
                                              description:"Caso seu atendimento não foi como esperado.",
                                              value: `${idgerado}_ruim`,
                                              emoji: "☹"
                                            },
                                            {
                                                label: "Regular",
                                                description:"Caso seu atendimento não foi ruim mas pode melhorar.",
                                                value: `${idgerado}_regular`,
                                                emoji: "😐"
                                              },
                                              {
                                                label: "Bom",
                                                description:"Caso o atendimento atende suas expectativas.",
                                                value: `${idgerado}_bom`,
                                                emoji: "😀"
                                              },
                                          )
                                      ),
                                ]
                            }).catch(() => {});
                        }

                        if(canal_logs) {
                            canal_logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(`📄 \`Log de Atendimento\``)
                                    .addFields(
                                      {
                                        name:`⛔ Ticket Fechado por:`,
                                        value: `${interaction.user}`,
                                        inline: true
                                      },
                                      {
                                        name:`✅ Ticket Aberto por:`,
                                        value: `${user.user}`,
                                        inline: true
                                      },
                                      {
                                        name:`👤 Ticket Assumido por:`,
                                        value: `${ass}`,
                                        inline: true
                                      },            
                                      {
                                        name:`🌐 Quantidade assumido`,
                                        value: `${quantidadeAssumido}`,
                                        inline: true
                                      },
                                      {
                                        name:`🆔 ID do Ticket`,
                                        value: `*\`${idgerado}\`*`,
                                        inline: true
                                      },
                                      {
                                        name:`💡 Fechado`,
                                        value: `<t:${Math.round(new Date().getTime() / 1000)}:f> (<t:${Math.round(new Date().getTime() / 1000)}:R>)`,
                                        inline: true
                                      },
                                    )
                                ],
                                components: [
                                    new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                        .setCustomId(`${idgerado}_slv`)
                                        .setLabel("Carregar Transcript")
                                        .setStyle(3)
                                        .setEmoji(`📑`),
                                        new ButtonBuilder()
                                        .setCustomId(`${user.id}_historico`)
                                        .setLabel("Histórico do membro")
                                        .setStyle(2)
                                        .setEmoji(`<:User:1181014051220901939>`),
                                    )
                                ]
                            });
                        }
                    }
                    if(interaction.isButton()) {
                        const customId = interaction.customId;
                        if(customId.endsWith("_historico")) {
    const userId = customId.split("_")[0];
    const userLogs = db4.get(`${userId}`)

    if (!userLogs || userLogs.length === 0) {
      interaction.reply({ content: `Não conseguir encontrar este usuario na minha database`, ephemeral: true });
      return;
    }

    let currentPage = 0;

    const maxPage = userLogs.length - 1;

    const embed = new EmbedBuilder()
      .setTitle("Registros de Tickets")
      .setDescription("Aqui estão seus registros de tickets:")
      .addFields({name:"Dono do Ticket", value: `${interaction.guild.members.cache.get(userLogs[currentPage].dono_ticket)}`, inline:true})
      .addFields({name:"Fechou o Ticket",value:  `${interaction.guild.members.cache.get(userLogs[currentPage].fechou_ticket)}`, inline:true})
      .addFields({name:"Assumido", value: `${interaction.guild.members.cache.get(userLogs[currentPage].assumido)?? `Ninguem Assumiu`}`, inline:true})
      .addFields({name:"Motivo", value: `\`${userLogs[currentPage].motivo}\``, inline:true})
      .addFields({name:"Código", value: `\`${userLogs[currentPage].codigo}\``, inline:true})
      .addFields({name:"Tipo", value: `\`${userLogs[currentPage].tipo}\``, inline:true})
      .setFooter({text:`Página ${currentPage + 1} de ${userLogs.length}`})
      .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previousPage")
          .setLabel("Página Anterior")
          .setStyle(1)
          .setDisabled(currentPage === 0), 
        new ButtonBuilder()
          .setCustomId("nextPage")
          .setLabel("Próxima Página")
          .setStyle(1)
          .setDisabled(currentPage === maxPage), 
      );

    const ds = await interaction.reply({ embeds: [embed], components: [row], ephemeral:true });

    const filter = (i) => i.customId === "previousPage" || i.customId === "nextPage";

    const collector = interaction.channel.createMessageComponentCollector({ filter});

    collector.on("collect", (i) => {
      if (i.customId === "previousPage" && currentPage > 0) {
        currentPage--;
        embed.fields = [];
        embed
        .setFields({name:"Dono do Ticket", value: `${interaction.guild.members.cache.get(userLogs[currentPage].dono_ticket)}`, inline:true} ,{name:"Fechou o Ticket",value:  `${interaction.guild.members.cache.get(userLogs[currentPage].fechou_ticket)}`, inline:true}, {name:"Assumido", value: `${interaction.guild.members.cache.get(userLogs[currentPage].assumido)?? `Ninguem Assumiu`}`, inline:true}, {name:"Motivo", value: `\`${userLogs[currentPage].motivo}\``, inline:true}, {name:"Código", value: `\`${userLogs[currentPage].codigo}\``, inline:true}, {name:"Tipo", value: `\`${userLogs[currentPage].tipo}\``, inline:true})
          .setFooter({text:`Página ${currentPage + 1} de ${userLogs.length}`}).setTimestamp();
          const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previousPage")
              .setLabel("Página Anterior")
              .setStyle(1)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId("nextPage")
              .setLabel("Próxima Página")
              .setStyle(1)
              .setDisabled(currentPage === maxPage),
          );
          i.update({ embeds: [embed], components: [row1] });
      } else if (i.customId === "nextPage" && currentPage < maxPage) {
        currentPage++;
        embed.fields = [];
        embed
        .setFields({name:"Dono do Ticket", value: `${interaction.guild.members.cache.get(userLogs[currentPage].dono_ticket)}`, inline:true} ,{name:"Fechou o Ticket",value:  `${interaction.guild.members.cache.get(userLogs[currentPage].fechou_ticket)}`, inline:true}, {name:"Assumido", value: `${interaction.guild.members.cache.get(userLogs[currentPage].assumido)?? `Ninguem Assumiu`}`, inline:true}, {name:"Motivo", value: `\`${userLogs[currentPage].motivo}\``, inline:true}, {name:"Código", value: `\`${userLogs[currentPage].codigo}\``, inline:true}, {name:"Tipo", value: `\`${userLogs[currentPage].tipo}\``, inline:true})
          .setFooter({text:`Página ${currentPage + 1} de ${userLogs.length}`}).setTimestamp();
          const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("previousPage")
              .setLabel("Página Anterior")
              .setStyle(1)
              .setDisabled(currentPage === 0),
            new ButtonBuilder()
              .setCustomId("nextPage")
              .setLabel("Próxima Página")
              .setStyle(1)
              .setDisabled(currentPage === maxPage),
          );
          i.update({ embeds: [embed], components: [row1] });
      }

    });

                        }
                    }

                    if (interaction.customId === "painel_avaliation") {
                        const options = interaction.values[0];
                        const canal = await db.get(`channel_logs`)
                        const canal_logs = interaction.client.channels.cache.get(canal);

                        if (options.endsWith("_ruim")) {
                            
                        const idgerado = options.split("_")[0]
                            interaction.update({
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                          .setCustomId("painel_avaliation")
                                          .setPlaceholder("❤ AGRADEÇEMOS PELO SEU FEEDBACK.")
                                          .setDisabled(true)
                                          
                                          .setOptions({label:"a",value:"a"})
                                      ),
                                ]
                            })

                            canal_logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`☹ **${interaction.user.username}** deu o feedback \`O atendimento não foi como esperado.\` para o ticket \`${idgerado}\``)
                                ]
                            })
                        }
                        if (options.endsWith("_regular")) {
                            
                            const idgerado = options.split("_")[0]

                            interaction.update({
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                          .setCustomId("painel_avaliation")
                                          .setPlaceholder("❤ AGRADEÇEMOS PELO SEU FEEDBACK.")
                                          .setDisabled(true)
                                          
                                          .setOptions({label:"a",value:"a"})
                                      ),
                                ]
                            })

                            canal_logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`😐 **${interaction.user.username}** deu o feedback \`atendimento não foi ruim mas pode melhorar.\` para o ticket \`${idgerado}\``)
                                ]
                            })
                        }
                        if (options.endsWith("_bom")) {
                            
                            const idgerado = options.split("_")[0]

                            interaction.update({
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                          .setCustomId("painel_avaliation")
                                          .setPlaceholder("❤ AGRADEÇEMOS PELO SEU FEEDBACK.")
                                          .setDisabled(true)
                                          
                                          .setOptions({label:"a",value:"a"})
                                      ),
                                ]
                            })

                            canal_logs.send({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`😀 **${interaction.user.username}** deu o feedback \`atendimento atende suas expectativas.\` para o ticket \`${idgerado}\``)
                                ]
                            })
                        }
                    }



}}

