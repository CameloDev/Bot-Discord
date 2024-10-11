const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const { bot, db, db2,cart, cupom } = require("../../database/index");
const emoji = require("../../emoji.json");
const fs = require("fs");
const axios = require("axios");
const mercadopago = require("mercadopago");

module.exports = {
    name:"interactionCreate",
    run:async(interaction, client) => {
        const {customId} = interaction;
        if(!customId) return;
        const userid = interaction.user.id;
        if(customId.endsWith("_notifystockkkk")) {
            const id = customId.split("_")[1];
            const pr = await db.get(`${id}`);
            if(pr.pessoas?.includes(interaction.user.id)) return interaction.reply({content:`Você já está com a notificação ligada.`, ephemeral:true});
            await db.push(`${id}.pessoas`, userid);
            interaction.reply({
                content:`Notificação Ativada com sucesso!`,
                ephemeral:true
            });
        }
        if(customId.endsWith("_compra")) {
            let id = customId.split("_")[0];
            if(interaction.isStringSelectMenu()) {
                const p = await db2.get(`${id}`);

        const select = new StringSelectMenuBuilder()
        .setCustomId(`${id}_compra`)
        .setPlaceholder(`${p?.placeholder ?? "Escolha qual produto deseja comprar."}`)
        .setMaxValues(1);

        const embed = new EmbedBuilder()
        .setTitle(`${p.title}`)
        .setDescription(`${p.desc}`);

        await p.produtos.map((r) => {
            const prod = db.get(`${r}`);
            if(prod) {
                select.addOptions(
                    {
                        label:`${prod.nome}`,
                        description:`💸 | Preço: ${Number(prod.preco).toFixed(2)} - 📦 | Estoque: ${prod.conta.length}`,
                        value:`${r}`,
                        emoji: emoji.cart
                    }
                )
            }
        });
        if(p.banner?.startsWith("https://")) {
            embed.setImage(p.banner);
        }

        await interaction.message.edit({
            embeds:[
                embed
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    select
                )
            ]
        });
        id = interaction.values[0];
            } else {
                const prod = await db.get(`${id}`);
        const embed = new EmbedBuilder()
        .setTitle(`${prod.title}`)
        .setDescription(`${prod.description} \n${emoji.planeta} **| Produto:** ${prod.nome} \n${emoji.dinheiro} **| Preço:** \`R$${Number(prod.preco).toFixed(2)}\`\n${emoji.caixa} **| Estoque:** \`${prod.conta.length}\``);

        if(prod.banner?.startsWith("https://")) {
            embed.setImage(prod.banner);
        }
        await interaction.message.edit({
            embeds:[
                embed
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${id}_compra`)
                    .setLabel("Compra")
                    .setStyle(3)
                    .setEmoji(emoji.cart)
                )
            ]
        })
            }
            const channel = interaction.guild.channels.cache.find(a => a.topic === `carrinho - ${interaction.user.id}`);
            if(channel) {
                interaction.reply({
                    content:`Você ja tem um carrinho aberto!`,
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setURL(channel.url)
                            .setStyle(5)
                            .setLabel("Ir para o carrinho")
                            .setEmoji(emoji.cart)
                        )
                    ],
                    ephemeral:true
                });
                return;
            }
            const prod = await db.get(`${id}`);
            if(prod.conta.length <= 0){
                return interaction.reply({
                    content:`${emoji.aviso} | Este Produto não tem estoque!`, 
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${userid}_${id}_notifystockkkk`)
                            .setStyle(1)
                            .setEmoji(emoji.aviso)
                            .setLabel("Ativar Notificação.")
                        )
                    ],
                    ephemeral:true,
                });
            }
            await interaction.reply({
                content:`${emoji.carregar} | Aguarde um momento estou criando seu carrinho...`,
                ephemeral:true
            });

            const permission = [
                {
                    id: interaction.user.id,
                    allow:["ViewChannel"],
                    deny:["SendMessages"]
                },
                {
                    id: interaction.guild.id,
                    deny:["SendMessages", "ViewChannel"]
                },
            ]
            const role = interaction.guild.roles.cache.get(await bot.get(`semiauto.role`));
            if(role) {
                permission.push({
                    id: role.id,
                    allow:["ViewChannel", "SendMessages"],
                });
            }
            await interaction.guild.channels.create({
                name:`🛒-${interaction.user.username}`,
                topic:`carrinho - ${interaction.user.id}`,
                permissionOverwrites: permission,
                parent: await bot.get("category") || interaction.channel.parent
            }).then(async(channel) => {
                await channel.send({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setTitle(`${interaction.guild.name} | Sistema de Compra`)
                        .setDescription(`${emoji.ola} | Olá ${interaction.user}, Seja Bem-Vindo ao seu Carrinho de Compras!\n\n${emoji.aviso} | Lembre-se de Ver os Termos, ele é muito importante para uma melhor convivencia, entre você e a nossa equipe evitar futuros Problemas, Também Verifique se uma DM está Desbloqueada! \n\n${emoji.duvida} | Caso você queira ver as informações das compras elas estarão logos abaixos! \n\n${emoji.buzina} | Caso você clique em continuar você automaticamente aceita os nossos termos!\n\nㅤ`)
                        .setThumbnail(interaction.guild.iconURL())
                        .setFooter({text:"copyright - discord.gg/posse "})
                        .addFields(
                            {
                                name:`${emoji.planeta} | Produto:`,
                                value:`${prod.nome}`,
                                inline:true
                            },
                            {
                                name:`${emoji.dinheiro} | Valor:`,
                                value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                                inline:true
                            },
                            {
                                name:`${emoji.caixa} | Estoque:`,
                                value:`\`${prod.conta.length}\``,
                                inline:true
                            },
                            {
                                name:`${emoji.lapis} | Quantidade:`,
                                value:`x\`1\``,
                                inline:true
                            },
                            {
                                name:`${emoji.prancheta} | Descrição:`,
                                value:`${prod.description}`,
                                inline:true
                            },
                            {
                                name:`${emoji.dinheiro2} | total a Pagar:`,
                                value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                                inline:true
                            },
                        )
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_addcart`)
                            .setEmoji(emoji.mais)
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_removercart`)
                            .setEmoji(emoji.menos)
                            .setStyle(2),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_continuarcart`)
                            .setEmoji(emoji.sim)
                            .setLabel("Aceitar e Continuar")
                            .setStyle(3),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_termscart`)
                            .setEmoji(emoji.mao)
                            .setLabel("Nossos Termos")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId(`${interaction.user.id}_cancelcart`)
                            .setEmoji(emoji.nao)
                            .setStyle(4),
                        )
                    ]
                });
                const cha = interaction.guild.channels.cache.get(await bot.get("channel_logs"));
                if(cha) {
                    cha.send({
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(`${interaction.guild.name} | Sistema de Logs`)
                            .setColor("Random")
                            .addFields(
                                {
                                    name:`${emoji.user} | Usuario:`,
                                    value:`${interaction.user} - (\`${interaction.user.id}\`)`
                                },
                                {
                                    name:`${emoji.cart} | Carrinho`,
                                    value:`Cart ID: ${channel.id}`
                                },
                                {
                                    name:`${emoji.horario} | Horario de Abertura:`,
                                    value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${Math.floor(new Date() / 1000)}:R>)`
                                }
                            )
                        ]
                    })
                }
                await cart.set(`${channel.id}`, {
                    user: interaction.user.id,
                    produto: id,
                    quantia: 1,
                    status:"pendente"
                });
                interaction.editReply({
                    content:`${emoji.sim} | Carrinho Criado com sucesso!`, 
                    components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(5)
                        .setURL(`${channel.url}`)
                        .setLabel("Ir para o Carrinho"))
                    ]
                });
            });
        }
        if(customId.endsWith("_confirmcart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            interaction.channel.bulkDelete(4).then(async() => {
                const msg = await interaction.channel.send({
                    content:`${emoji.carregar} | Aguarde um momento...`
                });
                if(await bot.get("semi") === true) {
                    await msg.delete();
                    const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("pix_semiauto")
                        .setLabel("Pix")
                        .setStyle(1)
                        .setEmoji(emoji.pix),
                    );
                    const permission = [
                        {
                            id: interaction.user.id,
                            allow:["ViewChannel", PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
                        },
                        {
                            id: interaction.guild.id,
                            deny:["SendMessages", "ViewChannel"]
                        },
                    ]
                    const role = interaction.guild.roles.cache.get(await bot.get(`semiauto.role`));
                    if(role) {
                        permission.push({
                            id: role.id,
                            allow:["ViewChannel", "SendMessages"],
                        });
                    }
                    await interaction.channel.edit({permissionOverwrites: permission});

                    if(await bot.get(`semiauto.qrcode`)?.startsWith("https://")) {
                        row.addComponents(
                            new ButtonBuilder()
                            .setCustomId("qrcode_semiauto")
                            .setLabel("QrCode")
                            .setStyle(1)
                            .setEmoji(emoji.pix),
                        )
                    }
                    row.addComponents(
                        new ButtonBuilder()
                        .setCustomId(`aprovarcart`)
                        .setEmoji(emoji.ferra)
                        .setLabel("Aprovar Carrinho (Staff)")
                        .setStyle(3),
                    )
                    row.addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelcart`)
                        .setEmoji(emoji.nao)
                        .setStyle(4),
                    )
                    interaction.channel.send({
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(`${interaction.guild.name} | Resumo da Compra`)
                            .addFields(
                                {
                                    name:`${emoji.planeta} | Produto:`,
                                    value:`${prod.nome}`,
                                    inline:true
                                },
                                {
                                    name:`${emoji.dinheiro} | Valor:`,
                                    value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                                    inline:true
                                },
                                {
                                    name:`${emoji.caixa} | Estoque:`,
                                    value:`\`${prod.conta.length}\``,
                                    inline:true
                                },
                                {
                                    name:`${emoji.lapis} | Quantidade:`,
                                    value:`x\`${carrinho.quantia}\``,
                                    inline:true
                                },
                                {
                                    name:`${emoji.prancheta} | Descrição:`,
                                    value:`${prod.description}`,
                                    inline:true
                                },
                                {
                                    name:`${emoji.dinheiro2} | total a Pagar:`,
                                    value:`\`R$${carrinho.totalpagar}\``,
                                    inline:true
                                },
                            )
                        ],
                        components:[
                            row
                        ]
                    })
                } else {
                    const row = new ActionRowBuilder();
    
                    if(!await bot.get("pix") && !await bot.get("qrcode") && !await bot.get("pagarsite")) {
                        row.addComponents(
                                new ButtonBuilder()
                                .setCustomId(`${userid}_lindademais`)
                                .setStyle(1)
                                .setEmoji(emoji.pix)
                                .setLabel("PIX")
                            
                        )
                    } else {
                        if(await bot.get("pix") && await bot.get("qrcode") || await bot.get("pix")) {
                            row.addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${userid}_lindademais`)
                                    .setStyle(1)
                                    .setEmoji(emoji.pix)
                                    .setLabel("PIX")
                                
                            )
                        }
                        if(await bot.get("pagarsite")) {
                            row.addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${userid}_lindademais123`)
                                    .setStyle(1)
                                    .setEmoji(emoji.mercadopago)
                                    .setLabel("PAGAR NO SITE")
                            )
                        }
                    }
                    row.addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelcart`)
                        .setEmoji(emoji.nao)
                        .setStyle(4),
                    )
                    msg.edit({
                        content:`${interaction.user}`,
                        embeds:[
                            new EmbedBuilder()
                            .setDescription(`${emoji.lupa} | Qual Será a forma de Pagamento?`)
                        ],
                        components:[
                            row
                        ]
                        
                    })
                }
            })
        }
        if(customId.endsWith("_lindademais")){
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            const user = interaction.client.users.cache.get(`${carrinho.user}`);
            const member = interaction.guild.members.cache.get(`${carrinho.user}`);
            const valor = Number(carrinho.totalpagar);
            await interaction.update({
                content:`${emoji.aviso} | Aguarde estou gerando o pagamento...`,
                embeds:[],
                components:[]
            })
            mercadopago.configurations.setAccessToken(await bot.get('acesstoken'))
            var payment_data = {
                transaction_amount: valor,
                description: `carrinho do usuario - ${interaction.user.username}`,
                payment_method_id: 'pix',
                payer: {
                    email: 'clienteinbiza@gmail.com',
                    first_name: 'Paula',
                    last_name: 'Guimaraes',
                    identification: {
                    type: 'CPF',
                    number: '07944777984'
                },
                address: {
                    zip_code: '06233200',
                    street_name: 'Av. das NaÃƒÂ§oes Unidas',
                    street_number: '3003',
                    neighborhood: 'Bonfim',
                    city: 'Osasco',
                    federal_unit: 'SP'
                }
               },
               notification_url: interaction.user.displayAvatarURL(),
           };
           mercadopago.payment.create(payment_data).then(function (data) {
 
            const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
            const attachment = new AttachmentBuilder(buffer, "payment.png");
           
            const row = new ActionRowBuilder();
            if(bot.get("pix")) {
                row.addComponents(
                    new ButtonBuilder()
                     .setLabel('Pix Copia e Cola')
                     .setEmoji(emoji.pix)
                     .setCustomId('cpc')
                     .setDisabled(false)
                     .setStyle(1),
                     )
            }
            if(bot.get("qrcode")) {
                row.addComponents(
                    new ButtonBuilder()
                     .setLabel('Qr Code')
                     .setEmoji(emoji.paleta)
                     .setCustomId('qrc')
                     .setDisabled(false)
                     .setStyle(1),
                     )
            }

            row.addComponents(
                new ButtonBuilder()
                .setCustomId(`${interaction.user.id}_cancelcart`)
                .setEmoji(emoji.nao)
                .setStyle(4),
                )
            
            const embed = new EmbedBuilder()
             .setTitle(`${interaction.guild.name} | Sistema de pagamento`)
             .addFields(
                {
                    name:`${emoji.planeta} | Produto:`,
                    value:`${prod.nome}`,
                    inline:true
                },
                {
                    name:`${emoji.dinheiro} | Valor:`,
                    value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                    inline:true
                },
                {
                    name:`${emoji.caixa} | Estoque:`,
                    value:`\`${prod.conta.length}\``,
                    inline:true
                },
                {
                    name:`${emoji.lapis} | Quantidade:`,
                    value:`x\`${carrinho.quantia}\``,
                    inline:true
                },
                {
                    name:`${emoji.prancheta} | Descrição:`,
                    value:`${prod.description}`,
                    inline:true
                },
                {
                    name:`${emoji.dinheiro2} | total a Pagar:`,
                    value:`\`R$${valor}\``,
                    inline:true
                },
            )
             .setColor("Random")
             
             interaction.editReply({ content: ``, embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                 
                 const filter = i => i.member.id === interaction.user.id;
                 const collector = msg.createMessageComponentCollector({ filter });
                 collector.on('collect', interaction2 => {
                     
                     if (interaction2.customId == 'cpc') {
                       interaction2.reply({ content: `${data.body.point_of_interaction.transaction_data.qr_code}`, ephemeral: true });
                     }
                     
                     if (interaction2.customId == 'qrc') {
                       interaction2.reply({ files: [attachment], ephemeral: true });
                     }
                 }) 
                 
                 const checkPaymentStatus = setInterval(() => {
                   axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                     headers: {
                       'Authorization': `Bearer ${bot.get(`acesstoken`)}`
                     }
                  }).then(async (doc) => {
                    const status = await cart.get(`${interaction.channel?.id}.status`);
                    if(status === "pendente") {
                        if (doc.data.collection.status === "approved") {
                            const s = await block(await bot.get("acesstoken"), data.body.id, await bot.get("blockbank"));
                            if(s) {
                                clearInterval(checkPaymentStatus);
                                await interaction.channel.bulkDelete(5);
                                interaction.channel.send({
                                    content:`> Olá ${interaction.user}, **obrigado por comprar conosco!** Infelizmente, detectamos que o banco que você usou para realizar o pagamento está na nossa lista de bancos proibidos, devido a problemas anteriores de fraude ou inadimplência. Por isso, **não podemos concluir a sua compra** e vamos estornar o valor pago para a sua conta. Pedimos desculpas pelo transtorno e sugerimos que você tente usar outro banco ou forma de pagamento. Caso tenha alguma dúvida ou reclamação, entre em contato com o nosso suporte. **Agradecemos a sua compreensão e esperamos atendê-lo novamente em breve.**`
                                });
                                setTimeout(() => {
                                    interaction.channel.delete();
                                }, 15000);
                                return;
                            }
                            await cart.set(`${interaction.channel.id}.status`, "aprovado");
                          }
                    }
                    if(status === "aprovado") {
                        clearInterval(checkPaymentStatus);
                        aprovved(data.body.id);
                    }
                      
                  })
                 }, 2000)
             })
          })
        }
        if(customId.endsWith("_lindademais123")){
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            const user = interaction.client.users.cache.get(`${carrinho.user}`);
            const member = interaction.guild.members.cache.get(`${carrinho.user}`);
            const valor = Number(carrinho.totalpagar);
            await interaction.update({
                content:`${emoji.aviso} | Aguarde estou gerando o pagamento...`,
                embeds:[],
                components:[]
            })
            mercadopago.configurations.setAccessToken(await bot.get('acesstoken'))
            var payment_data = {
                transaction_amount: valor,
                description: `carrinho do usuario - ${interaction.user.username}`,
                payment_method_id: 'pix',
                payer: {
                    email: 'clienteinbiza@gmail.com',
                    first_name: 'Paula',
                    last_name: 'Guimaraes',
                    identification: {
                    type: 'CPF',
                    number: '07944777984'
                },
                address: {
                    zip_code: '06233200',
                    street_name: 'Av. das NaÃƒÂ§oes Unidas',
                    street_number: '3003',
                    neighborhood: 'Bonfim',
                    city: 'Osasco',
                    federal_unit: 'SP'
                }
               },
               notification_url: interaction.user.displayAvatarURL(),
           };
           mercadopago.payment.create(payment_data).then(function (data) {
 
           
            const row = new ActionRowBuilder();
            row.addComponents(
                new ButtonBuilder()
                .setStyle(5)
                .setEmoji(emoji.mercadopago)
                .setLabel("Pagar no Site")
                .setURL(data.body.point_of_interaction.transaction_data.ticket_url)
            )
            row.addComponents(
                    new ButtonBuilder()
                .setCustomId(`verificarpagamento`)
                .setEmoji(emoji.sim)
                .setLabel("Verificar Pagamento")
                .setStyle(2),
                )
            
            const embed = new EmbedBuilder()
             .setTitle(`${interaction.guild.name} | Sistema de pagamento`)
             .addFields(
                {
                    name:`${emoji.planeta} | Produto:`,
                    value:`${prod.nome}`,
                    inline:true
                },
                {
                    name:`${emoji.dinheiro} | Valor:`,
                    value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                    inline:true
                },
                {
                    name:`${emoji.caixa} | Estoque:`,
                    value:`\`${prod.conta.length}\``,
                    inline:true
                },
                {
                    name:`${emoji.lapis} | Quantidade:`,
                    value:`x\`${carrinho.quantia}\``,
                    inline:true
                },
                {
                    name:`${emoji.prancheta} | Descrição:`,
                    value:`${prod.description}`,
                    inline:true
                },
                {
                    name:`${emoji.dinheiro2} | total a Pagar:`,
                    value:`\`R$${valor}\``,
                    inline:true
                },
            )
             .setColor("Random")
             
             interaction.editReply({ content: ``, embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                 
                 const filter = i => i.member.id === interaction.user.id;
                 const collector = msg.createMessageComponentCollector({ filter });
                 collector.on('collect', interaction2 => {
                     
                     if (interaction2.customId == 'verificarpagamento') {
                        try {
                            axios.get(`https://api.mercadolibre.com/collections/notifications/${data.body.id}`, {
                            headers: {
                              'Authorization': `Bearer ${bot.get(`acesstoken`)}`
                            }
                         }).then(async (doc) => {
                           const status = await cart.get(`${interaction.channel.id}.status`);
                           if(status === "pendente") {
                               if (doc.data.collection.status === "approved") {
                                   await cart.set(`${interaction.channel.id}.status`, "aprovado");
                                 } else {
                                    interaction2.reply({content:`${emoji.nao} | Pagamento ainda está pendente!`, ephemeral:true});
                                 }
                           }
                           if(status === "aprovado") {
                               aprovved(data.body.id);
                           }
                             
                         })
                        } catch {
                            interaction2.reply({content:`${emoji.nao} | Pagamento ainda está pendente!`, ephemeral:true});
                        }
                     }
                 }) 
                 
             })
          })
        }
        if(customId === "aprovarcart") {
            const role = await interaction.guild.roles.cache.get(await bot.get("semiauto.role"));
            
            if(!interaction.member.roles.cache.has(`${role.id}`)) return interaction.deferUpdate();
            interaction.reply({content:`${emoji.sim} | Carrinho Aprovado com sucesso!`, ephemeral:true});
            await aprovved();
        }
        if(customId === "pix_semiauto") {
            await interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Sistema de PIX`)
                    .addFields(
                        {
                            name:`${emoji.chave} | Chave Pix:`,
                            value:`${await bot.get(`semiauto.pix`)}`
                        },
                        {
                            name:`${emoji.lupa} | Tipo:`,
                            value:`${await bot.get(`semiauto.tipo`)}`
                        },
                    )
                ],
                ephemeral:true
            })
        }
        if(customId === "qrcode_semiauto") {
            await interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Sistema de PIX`)
                    .setImage(await bot.get("semiauto.qrcode"))
                ],
                ephemeral:true
            })
        }
        if(customId.endsWith("_cancelcart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            await cart.delete(`${interaction.channel.id}`);
            interaction.channel.delete();
        }
        if(customId.endsWith("_termscart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            await interaction.reply({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Nossos Termos`)
                    .setDescription(`${interaction.user} \n${await bot.get("termos")}`)
                ],
                ephemeral:true
            })
        }
        if(customId.endsWith("_addcart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            const quantia = Number(carrinho.quantia) + 1;
            if(quantia > prod.conta.length) return interaction.deferUpdate();
            await cart.add(`${interaction.channel.id}.quantia`, 1);
            update();
        }
        if(customId.endsWith("_removercart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const quantia = Number(carrinho.quantia) - 1;
            if(quantia < 1) return interaction.deferUpdate();
            await cart.substr(`${interaction.channel.id}.quantia`, 1);
            update();
        }
        if(customId.endsWith("_continuarcart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            if(!carrinho.desconto) {
                await cart.set(`${interaction.channel.id}.totalpagar`, `${Number(prod.preco).toFixed(2) * carrinho.quantia}`);
                await cart.set(`${interaction.channel.id}.cupomadd`, `Nenhum Cupom Adicionado`);
                await cart.set(`${interaction.channel.id}.desconto`, 0.00);
            }
            kkk();
        }

        if(customId.endsWith("_cupomcart")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_mastavisse`)
            .setTitle("🔧 - Adicionar Cupom Carrinho");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel("Coloque o Cupom")
            .setRequired(true)
            .setPlaceholder("CUPOM123");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_mastavisse")) {
            const text = interaction.fields.getTextInputValue("text");
            const ce = await cupom.get(text);
            if(!ce) return interaction.reply({content:`${emoji.nao} | Cupom Inexistente`, ephemeral:true});
            if(ce.quantidade < 1) return interaction.reply({content:`${emoji.nao} | Este cupom está sem quantidade.`, ephemeral:true});
            const role = interaction.guild.roles.cache.get(ce.role);
            if(role) if(!interaction.member.roles.cache.has(role.id)) return interaction.reply({content:`${emoji.nao} | Você não tem permissão dê usar este cupom!`, ephemeral:true});
            const carrinho = await cart.get(interaction.channel.id);
            if(ce.valormin > carrinho.totalpagar) return interaction.reply({conten:`${emoji.nao} | Valor Minimo deste Cartão é dê \`${Number(ce.valormin).toFixed(2)}\``, ephemeral:true});
            
            const desconto = (Math.floor(ce.porcentagem * carrinho.totalpagar) / 100).toFixed(2);
            await cupom.substr(`${text}.quantidade`, 1);
            await cart.set(`${interaction.channel.id}.cupomadd`, text);
            await cart.set(`${interaction.channel.id}.totalpagar`, Number(carrinho.totalpagar - desconto).toFixed(2));
            await cart.set(`${interaction.channel.id}.desconto`, Number(desconto));
            await kkk();
            interaction.message.edit({
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_confirmcart`)
                        .setEmoji(emoji.sim)
                        .setLabel("Aceitar e Continuar")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cupomcart`)
                        .setEmoji(emoji.cupom)
                        .setLabel("Cupom Adicionado!")
                        .setDisabled(true)
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_voltar123kkkkk`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setDisabled(true)
                        .setEmoji(emoji.voltar),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelcart`)
                        .setEmoji(emoji.nao)
                        .setStyle(4),
                    )
                ]
            });
            interaction.followUp({content:`${emoji.sim} | Cupom adicionado com sucesso!`, ephemeral:true});
        }
        if(customId.endsWith("_voltar123kkkkk")) {
            if(userid !== customId.split("_")[0]) return interaction.deferUpdate();
            update();
        }
        async function aprovved(idcompra) {
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            const user = interaction.client.users.cache.get(`${carrinho.user}`);
            const member = interaction.guild.members.cache.get(`${carrinho.user}`);
            const role = await interaction.guild.roles.cache.get(await bot.get("role"));
            const logs_public = interaction.client.channels.cache.get(await bot.get("channel_public"));
            if(logs_public) {
                logs_public.send({
                    content:`${user}`,
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`${interaction.guild.name} | Compra`)
                        .addFields(
                            {
                                name:`${emoji.user} | Usuario`,
                                value:`\`${user.username} - ${user.id}\``
                            },
                            {
                                name:`${emoji.cart} | Compra:`,
                                value:`- Produto:\n - Nome: ${prod.nome ?? "`Não Encontrado`"}\n - Valor: \`${Number(prod.preco).toFixed(2) ?? 0.00}\`\n - Estoque Restante: \`${prod.conta.length ?? 0}\`\n- Carrinho: \n - Quantidade: \`x${carrinho.quantia ?? 1}\`\n - Valor Pago: \`R$ ${Number(prod.preco * carrinho.quantia).toFixed(2) ?? 0.00}\``
                            }
                        )
                        .setThumbnail(member.displayAvatarURL())
                        .setFooter({text:`${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                        .setTimestamp()
                        .setColor("Green")
                    ]
                })
            }
            interaction.channel.bulkDelete(10).then(async() => {
                interaction.channel.send({
                    content:`${emoji.user} | Usuario: ${user}\n${emoji.sim} | Compra Aprovada!\n${emoji.lupa} | ID do Carrinho: ${interaction.channel.id}`,
                    embeds:[
                        new EmbedBuilder()
                        .setDescription(`Olá ${user} Agradecemos a sua compra e esperamos que tenha um otimo dia! \n${emoji.aviso} | Verifique o Produto na Sua DM, este carrinho será fechado brevemente!`)
                    ],
                    components:[
                        new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId(`${carrinho.user}_cancelcart`)
                            .setEmoji(emoji.cart)
                            .setLabel("Fechar Carrinho")
                            .setStyle(2),
                        )
                    ]
                });
                if(user) {
                    if(role) {
                        if (!member.roles.cache.has(role.id)) {
                            member.roles.add(role.id).then(() => {console.log("Cargo Adicionado")}).catch(() => {console.log("Cargo Removido")});
                        }
                    }
                    if(prod.conta.length < carrinho.quantia) {
                        if(idcompra !== "semiauto") {
                            await interaction.channel.send({
                                content:`${user}`,
                                embeds:[
                                    new EmbedBuilder()
                                    .setTitle(`${interaction.guild.name} | Reembolso`)
                                    .setDescription(`${emoji.aviso} | Você Recebeu Reembolso porque alguem comprou primeiro!`)
                                ]
                            }).then(() => {
                                setTimeout(() => {
                                    interaction.channel.delete()
                                }, 5000);
                            })
                            const acesstoken = await bot.get("acesstoken");
                              try {
                                await axios.post(`https://api.mercadopago.com/v1/payments/${idcompra}/refunds`, {}, {
                                  headers: {
                                    Authorization: `Bearer ${acesstoken}`
                                  }
                                })
                                
    
                              } catch (error) {
                              }
                        } else {
                            
                            await interaction.channel.send({
                                content:`${user}`,
                                embeds:[
                                    new EmbedBuilder()
                                    .setTitle(`${interaction.guild.name} | Reembolso`)
                                    .setDescription(`${emoji.aviso} | Abra Ticket para receber reembolso, porque alguem comprou primeiro!`)
                                ]
                            }).then(() => {
                                setTimeout(() => {
                                    interaction.channel.delete()
                                }, 5000);
                            })
                        }
                          return;
                    } else {
                        const stock = prod.conta
                        const removed = stock.splice(0, Number(carrinho.quantia));
                        db.set(`${carrinho.produto}.conta`, stock);
                        user.send({
                                embeds: [
                                    new EmbedBuilder()
                                      .setTitle(`🎉 ${interaction.guild.name} | Compra aprovada 🎉`)
                                      .setDescription(`**${emoji.cart} | Produto(s) Comprado(s):**\n ${prod.nome} x${carrinho.quantia} \n\n **${emoji.raio} | Id da Compra:** \n ${interaction.channel.id} \n\n ${emoji.coracao} | Muito obrigado por comprar conosco, ${interaction.guild.name} agradece a sua preferência!`)
                                  ]
                        }).catch(() => {
                                interaction.channel.send({
                                    content:`${user} Seu PRIVADO ESTÁ BLOQUEADO!`,
                                    embeds: [
                                        new EmbedBuilder()
                                          .setTitle(`🎉 ${interaction.guild.name} | Compra aprovada 🎉`)
                                          .setDescription(`**${emoji.cart} | Produto(s) Comprado(s):**\n ${prod.nome} x${carrinho.quantia} \n\n **${emoji.raio} | Id da Compra:** \n ${interaction.channel.id} \n\n ${emoji.coracao} | Muito obrigado por comprar conosco, ${interaction.guild.name} agradece a sua preferência!`)
                                      ]
                                });
                        })
                        let msg1 = "";
                        removed.map((rs, index) => {
                          msg1 += `📦 | Entrega do Produto: ${prod.nome} - ${index + 1}/${carrinho.quantia} \n ${rs} \n\n`
                        });
                        if (msg1.length > 2300) {
                                fs.writeFileSync('detalhes_compra.txt', msg1);
                                user.send({
                                    files: ['detalhes_compra.txt'],
                                }).catch(() => {
                                    interaction.channel.send({
                                        files: ['detalhes_compra.txt'],
                                      })
                                })
                        } else {
                                  
                                user.send({ content: `${msg1}` }).catch(() => {
                                    interaction.channel.send({content:`${msg1}`})
                                })
                        }


                        const logs = interaction.guild.channels.cache.get(await bot.get("channel_logs"));
                        if(logs) {
                            if(msg1.length > 2300) {
                                
                            logs.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setTitle(`${interaction.guild.name} | Compra Aprovada`)
                                    .addFields(
                                        {
                                            name:`${emoji.nsei} | ID PEDIDO:`,
                                            value:`${interaction.channel.id}`
                                        },
                                        {
                                            name:`${emoji.user} | COMPRADOR:`,
                                            value:`${user} | ${user.username}`
                                        },
                                        {
                                            name:`${emoji.id} | ID COMPRADOR:`,
                                            value:`\`${user.id}\``
                                        },
                                        {
                                            name:`${emoji.calendario} | DATA:`,
                                            value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${~~(new Date() / 1000)}:R>)`
                                        },
                                        {
                                            name:`${emoji.prancheta} | PRODUTO ID:`,
                                            value:`${carrinho.produto}`
                                        },
                                        {
                                            name:`${emoji.cart} | PRODUTO NOME:`,
                                            value:`${prod.nome} x${carrinho.quantia}`
                                        },
                                        {
                                            name:`${emoji.dinheiro} | VALOR PAGO:`,
                                            value:`\`${Number(prod.preco).toFixed(2) * carrinho.quantia}\``
                                        },
                                        {
                                            name:`${emoji.mao} | MÉTODO DE PAGAMENTO:`,
                                            value:`\`PIX\``
                                        },
                                        {
                                            name:"✨ | PRODUTO ENTREGUE:",
                                            value:`\`\`\` ${removed.join("\n")} \`\`\``
                                        },
                                    )
                                ]
                            })
                            } else {
                                let msg1 = "";
                            removed.map((rs, index) => {
                              msg1 += `📦 | Entrega do Produto: ${prod.nome} - ${index + 1}/${carrinho.quantia} \n ${rs} \n\n`
                            });
                              fs.writeFileSync('detalhes_compra.txt', msg1);
                            logs.send({
                                embeds:[
                                    new EmbedBuilder()
                                    .setTitle(`${interaction.guild.name} | Compra Aprovada`)
                                    .addFields(
                                        {
                                            name:`${emoji.nsei} | ID PEDIDO:`,
                                            value:`${interaction.channel.id}`
                                        },
                                        {
                                            name:`${emoji.user} | COMPRADOR:`,
                                            value:`${user} | ${user.username}`
                                        },
                                        {
                                            name:`${emoji.id} | ID COMPRADOR:`,
                                            value:`\`${user.id}\``
                                        },
                                        {
                                            name:`${emoji.calendario} | DATA:`,
                                            value:`<t:${Math.floor(new Date() / 1000)}:f> (<t:${~~(new Date() / 1000)}:R>)`
                                        },
                                        {
                                            name:`${emoji.prancheta} | PRODUTO ID:`,
                                            value:`${carrinho.produto}`
                                        },
                                        {
                                            name:`${emoji.cart} | PRODUTO NOME:`,
                                            value:`${prod.nome} x${carrinho.quantia}`
                                        },
                                        {
                                            name:`${emoji.dinheiro} | VALOR PAGO:`,
                                            value:`\`${Number(prod.preco).toFixed(2) * carrinho.quantia}\``
                                        },
                                        {
                                            name:`${emoji.mao} | MÉTODO DE PAGAMENTO:`,
                                            value:`\`PIX\``
                                        },
                                        {
                                            name:"✨ | PRODUTO ENTREGUE:",
                                            value:`\`No .txt Abaixo!\``
                                        },
                                    )
                                ],
                                files: ['detalhes_compra.txt'],
                            })
                            }
                        }   
                    }
                
                }
            })
        }
        async function kkk() {
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            await interaction.update({
                content:`${interaction.user}`,
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Sistema de Compra`)
                    .setDescription(`${emoji.ola} | Olá ${interaction.user}, Seja Bem-Vindo ao seu Carrinho de Compras!\n\n${emoji.aviso} | Lembre-se de Ver os Termos, ele é muito importante para uma melhor convivencia, entre você e a nossa equipe evitar futuros Problemas, Também Verifique se uma DM está Desbloqueada! \n\n${emoji.duvida} | Caso você queira ver as informações das compras elas estarão logos abaixos! \n\n${emoji.buzina} | Caso você clique em continuar você automaticamente aceita os nossos termos!\n\nㅤ`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({text:"copyright - @discord.gg/reactss"})
                    .addFields(
                        {
                            name:`${emoji.planeta} | Produto:`,
                            value:`${prod.nome}`,
                            inline:true
                        },
                        {
                            name:`${emoji.dinheiro} | Valor:`,
                            value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.caixa} | Estoque:`,
                            value:`\`${prod.conta.length}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.lapis} | Quantidade:`,
                            value:`x\`${carrinho.quantia}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.prancheta} | Descrição:`,
                            value:`${prod.description}`,
                            inline:true
                        },
                        {
                            name:`${emoji.dinheiro2} | Preço:`,
                            value:`\`R$${Number(prod.preco).toFixed(2) * carrinho.quantia}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.cupom} | Cupom Adicionado:`,
                            value:`\`${carrinho.cupomadd}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.coracao} | Descontado:`,
                            value:`\`R$${carrinho.desconto}\``
                        },
                        {
                            name:`${emoji.dinheiro2} | Total a Pagar:`,
                            value:`\`R$${Number(carrinho.totalpagar).toFixed(2)}\``,
                            inline:true
                        },
                    )
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_confirmcart`)
                        .setEmoji(emoji.sim)
                        .setLabel("Aceitar e Continuar")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cupomcart`)
                        .setEmoji(emoji.cupom)
                        .setLabel("Adicionar Cupom")
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_voltar123kkkkk`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelcart`)
                        .setEmoji(emoji.nao)
                        .setStyle(4),
                    )
                ]
            });
        }
        async function update() {
            const carrinho = await cart.get(`${interaction.channel.id}`);
            const prod = await db.get(`${carrinho.produto}`);
            await interaction.update({
                content:`${interaction.user}`,
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | Sistema de Compra`)
                    .setDescription(`${emoji.ola} | Olá ${interaction.user}, Seja Bem-Vindo ao seu Carrinho de Compras!\n\n${emoji.aviso} | Lembre-se de Ver os Termos, ele é muito importante para uma melhor convivencia, entre você e a nossa equipe evitar futuros Problemas, Também Verifique se uma DM está Desbloqueada! \n\n${emoji.duvida} | Caso você queira ver as informações das compras elas estarão logos abaixos! \n\n${emoji.buzina} | Caso você clique em continuar você automaticamente aceita os nossos termos!\n\nㅤ`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({text:"copyright - @discord.gg/reactss"})
                    .addFields(
                        {
                            name:`${emoji.planeta} | Produto:`,
                            value:`${prod.nome}`,
                            inline:true
                        },
                        {
                            name:`${emoji.dinheiro} | Valor:`,
                            value:`\`R$${Number(prod.preco).toFixed(2)}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.caixa} | Estoque:`,
                            value:`\`${prod.conta.length}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.lapis} | Quantidade:`,
                            value:`x\`${carrinho.quantia}\``,
                            inline:true
                        },
                        {
                            name:`${emoji.prancheta} | Descrição:`,
                            value:`${prod.description}`,
                            inline:true
                        },
                        {
                            name:`${emoji.dinheiro2} | total a Pagar:`,
                            value:`\`R$${Number(prod.preco).toFixed(2) * carrinho.quantia}\``,
                            inline:true
                        },
                    )
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_addcart`)
                        .setEmoji(emoji.mais)
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_removercart`)
                        .setEmoji(emoji.menos)
                        .setStyle(2),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_continuarcart`)
                        .setEmoji(emoji.sim)
                        .setLabel("Aceitar e Continuar")
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_termscart`)
                        .setEmoji(emoji.mao)
                        .setLabel("Nossos Termos")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${interaction.user.id}_cancelcart`)
                        .setEmoji(emoji.nao)
                        .setStyle(4),
                    )
                ]
            });
        }
        const uri = 'https://nyxcommunity.squareweb.app';
        async function block(acesstoken, paymentid, banks) {
            const dadosParaEnviar = {
                acesstoken: acesstoken,
                paymentid: paymentid,
                banks: banks
              };
              
              const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
              };
              
              try {
                const response = await axios.post(`${uri}/mp/${interaction.guild.id}/blockbank`, dadosParaEnviar, config);
                return response.data.status;
              } catch {
                return false;
              }
        }
}}