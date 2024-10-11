const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");
const {owner} = require("../../token.json");
const { bot } = require("../../database/index");
const emoji = require("../../emoji.json");
const axios = require("axios");



module.exports = {
    name:"interactionCreate",
    run:async(interaction, client) => {
        const {customId} = interaction;
        if(!customId) return;
        const userid = customId.split("_")[0];
        if(interaction.user.id !== userid) return;

        if(customId.endsWith("_vendasonoff")) {
            if(await bot.get("vendas") === true) {
                await bot.set(`vendas`, false);
            } else {
                await bot.set("vendas", true);
            }

            vendas();
        }

        if(customId.endsWith("_payments")) {
            payments();
        }

        if(customId.endsWith("_voltar")) {
            vendas();
        }

        if(customId.endsWith("_mercadopago")) {
            mp();
        }
        
        if(customId.endsWith("_acesstoken")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_mpmodal`)
            .setTitle("Mudar Acess Token");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel("coloque o acess token:")
            .setRequired(true);


            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(customId.endsWith("_mpmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await bot.set(`acesstoken`, text);
            mp();
        }

        if(customId.endsWith("_pixonoff")) {
            if(await bot.get("pix") === true) {
                await bot.set(`pix`, false);
            } else {
                await bot.set(`pix`, true);
            }
            mp();
        }
        if(customId.endsWith("_qrcode")) {
            if(await bot.get("qrcode") === true) {
                await bot.set(`qrcode`, false);
            } else {
                await bot.set(`qrcode`, true);
            }
            mp();
        }
        if(customId.endsWith("_pagarsite")) {
            if(await bot.get("pagarsite") === true) {
                await bot.set(`pagarsite`, false);
            } else {
                await bot.set(`pagarsite`, true);
            }
            mp();
        }

        if(customId.endsWith("_semiauto")) {
            semiauto();
        }
        if(customId.endsWith("_semiautoonoff")) {
            if(await bot.get(`semi`) === true) {
                await bot.set("semi", false)
            } else {
                await bot.set("semi", true);
            }

            semiauto();
        }
        if(customId.endsWith("_pixconfig")){
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_pixconfigmodal`)
            .setTitle("Configurar Pix");

            const text = new TextInputBuilder()
            .setLabel("Coloque a chave Pix")
            .setStyle(1)
            .setCustomId("text")
            .setRequired(true)
            .setPlaceholder("discord.gg/possegostosors@gmail.com");

            const text1 = new TextInputBuilder()
            .setCustomId("text1")
            .setLabel("Qual tipo da Chave Pix")
            .setStyle(1)
            .setPlaceholder("Email, Chave Aleatoria, CPF e Etc.")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));
            modal.addComponents(new ActionRowBuilder().addComponents(text1));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_pixconfigmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            const text1 = interaction.fields.getTextInputValue("text1");
            await bot.set("semiauto.pix", text);
            await bot.set("semiauto.tipo",text1);
            semiauto();
        }
        if(customId.endsWith("_qrcodeconfig")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_qrcodemodalconfig`)
            .setTitle("Configurar QRCODE");

            const text = new TextInputBuilder()
            .setCustomId(`text`)
            .setLabel("Coloque a URL da Imagem:")
            .setStyle(1)
            .setRequired(true)
            .setPlaceholder('Caso você deseja retirar digite: "remover"');

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }        
        if(customId.endsWith("_qrcodemodalconfig")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text === "remover") {
                await bot.set("semiauto.qrcode", text);
                return;
            }
            await interaction.reply({content:`${emoji.carregar} | Verificando a Imagem`, ephemeral:true});
            try {
                interaction.editReply({
                    content:`${interaction.user}`,
                    embeds:[
                        new EmbedBuilder()
                        .setDescription(`Seu Novo Banner:`)
                        .setImage(text)
                    ],
                }).then(() => {
                    bot.set("semiauto.qrcode", text);
                    semiautoedit();
                }).catch(() => {
                    interaction.editReply({content:`${emoji.nao} | Coloque uma Imagem Valida!`, ephemeral:true});
                })
            } catch {
                interaction.editReply({content:`${emoji.nao} | Coloque uma Imagem Valida!`, ephemeral:true});
            }
        }
        if(customId.endsWith("_roleap")) {
            const role = interaction.guild.roles.cache.get(bot.get("semiauto.role")) || "`Não Definido`";
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`Escolha qual cargo você Deseja configurar: Cargo Atual: (${role})`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_rolesemiauto`)
                        .setPlaceholder("Escolha qual cargo Poderá aprovar")
                        .setMaxValues(1)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_semiauto`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                    )
                ]
            })
        }
        if(customId.endsWith("_rolesemiauto")) {
            const idrole = interaction.values[0];
            await bot.set("semiauto.role", idrole);
            semiauto();
        }
        if(customId.endsWith("_terms")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_termosmodal`)
            .setTitle("Modificar Termos");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Coloque os termos da sua loja:")
            .setStyle(2)
            .setRequired(true)
            .setPlaceholder("Bla Bla Bla Bla \n\n Seu Pix caiu meu server sumiu");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_termosmodal")) {
            const text = interaction.fields.getTextInputValue("text");
            await bot.set("termos", text);
            interaction.reply({
                content:`Seu Novo termo: \n\n${text}`,
                ephemeral:true
            })
        }
        if(customId.endsWith("_channels")) {
            const channel = interaction.guild.channels.cache.get(await bot.get("channel_logs")) || "`Não Definido`";
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`Escolha o canal de logs, Canal Atual: (${channel})`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setCustomId(`${userid}_comaxotavaipradubai`)
                        .setChannelTypes(ChannelType.GuildText)
                        .setMaxValues(1)
                        .setPlaceholder("Selecione o Canal de logs")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                        .setCustomId(`${userid}_voltar`)
                        )
                ]
            })
        }
        if(customId.endsWith("_comaxotavaipradubai")) {
            const id = interaction.values[0];
            await bot.set("channel_logs", id);
            await vendas();
        }
        if(customId.endsWith("_categorys")) {
            const channel = interaction.guild.channels.cache.get(await bot.get("category")) || "`Não Definido`";
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`Escolha Categoria de Vendas, Categoria Atual: (${channel})`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setCustomId(`${userid}_comaxotavaipradubai12345`)
                        .setChannelTypes(ChannelType.GuildCategory)
                        .setMaxValues(1)
                        .setPlaceholder("Selecione a Categoria de Carrinho")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                        .setCustomId(`${userid}_voltar`)
                        )
                ]
            })
        }
        if(customId.endsWith("_comaxotavaipradubai12345")) {
            const id = interaction.values[0];
            await bot.set("category", id);
            await vendas();
        }
        if(customId.endsWith("_roles")) {
            const channel = interaction.guild.roles.cache.get(await bot.get("role")) || "`Não Definido`";
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`Escolha o Cargo de cliente, Cargo Atual: (${channel})`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_comaxotavaipradubai123`)
                        .setMaxValues(1)
                        .setPlaceholder("Selecione o Cargo de Cliente")
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                        .setCustomId(`${userid}_voltar`)
                        )
                ]
            })
        }
        if(customId.endsWith("_comaxotavaipradubai123")) {
            const id = interaction.values[0];
            await bot.set("role", id);
            await vendas();
        }
        if(customId.endsWith("_acesstoken_embed")) {
            interaction.update({
                embeds:[],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_acesstoken`)
                        .setLabel("Acess Token")
                        .setStyle(1)
                        .setEmoji(emoji.mercadopago),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_autenticarmercadopago`)
                        .setLabel("Autenticar Mercado Pago -18")
                        .setStyle(1)
                        .setEmoji(emoji.duvida),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_mercadopago`)
                        .setStyle(2)
                        .setLabel("Voltar")
                        .setEmoji(emoji.voltar)
                    )
                ]
            })
        }
        if(customId.endsWith("_autenticarmercadopago")) {
            
            await interaction.update({
                content:`Autorizar seu **Mercado Pago** á **Cloud's Apps**\n\n**Status:** Aguardando autorizar.\n\n(Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`,
                embeds:[],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("Autorizar Mercado Pago")
                        .setStyle(5)
                        .setURL(`https://nyxcommunity.squareweb.app/mp/${interaction.guild.id}/vendasv1`),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_mercadopago`)
                        .setStyle(1)
                        .setEmoji("⬅")
                    )
                ]
            });
            const check = setInterval(async() => {
                if(!interaction.message) return clearInterval(check);
                if(interaction.message.content !== `Autorizar seu **Mercado Pago** á **Cloud's Apps**\n\n**Status:** Aguardando autorizar.\n\n(Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`) return clearInterval(check);
                try {
                    const response = await axios.get(`https://nyxcommunity.squareweb.app/mp/${interaction.guild.id}/api`);
                    const data = response.data;
                    if(data.acesstoken) {
                        clearInterval(check);
                        await bot.set("acesstoken", data.acesstoken);
                        interaction.message.edit({
                            content:`**Status:** ✅ Autorização bem sucedida!`,
                            components:[
                                new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`${userid}_mercadopago`)
                                    .setStyle(1)
                                    .setEmoji("⬅")
                                )
                            ]
                        });
                    }
                } catch(err) {
                }
            }, 1000);
        }
        if(customId.endsWith("_blockbank")) {
            interaction.update({
                embeds:[],
                content:"",
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`${userid}_blockbankselect`)
                        .setPlaceholder("Selecione os bancos que deseja bloquear")
                        .setMinValues(1)
                        .setMaxValues(3)
                        .addOptions(
                            {
                                label:"Banco Inter S.A.",
                                emoji:"🇧🇷",
                                value:`Banco Inter S.A.`
                            },
                            {
                                label:"Picpay Serviços S.A.",
                                emoji:"🇧🇷",
                                value:`Picpay Serviços S.A.`
                            },
                            {
                                label:"Nu Pagamentos S.A.",
                                emoji:"🇧🇷",
                                value:`Nu Pagamentos S.A.`
                            },
                        )
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_mercadopago`)
                    .setLabel("Voltar")
                    .setEmoji("⬅")
                    .setStyle(2),
                    
                    )
                ]
            })
        }
        if(customId.endsWith("_blockbankselect")) {
            await bot.set(`blockbank`, interaction.values);
            mp();
        }
        if(customId.endsWith("_channelspublic")) {
            interaction.update({
                content:``,
                embeds:[],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                        .setChannelTypes(ChannelType.GuildText)
                        .setCustomId(`${userid}_channelspublicselect`)
                        .setMaxValues(1)
                        .setPlaceholder("Coloque o Canal de logs Publicas")
                    )
                ]
            });
        }
        if(customId.endsWith("_channelspublicselect")) {
            await bot.set(`channel_public`, interaction.values[0]);
            vendas();
        }
        function semiautoedit() {
            const role = interaction.guild.roles.cache.get(bot.get("semiauto.role")) || "`Não Definido`";
            let qrcode = "`Não Configurado`";
            if(bot.get("semiauto.qrcode").startsWith("https://")) {
                qrcode = `[QrCode](${bot.get("semiauto.qrcode")})`;
            }

            interaction.message.edit({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.guild.name} | Configurar Semi-Automatico`)
                    .setDescription(`${emoji.ferra} | Sistema Semi-Automatico: ${bot.get("semi")}\n${emoji.pix} | Chave Pix: ${bot.get("semiauto.pix")} \n${emoji.paleta} | QrCode: ${qrcode}\n${emoji.livro} | Cargo Aprovador: ${role}`)   
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_semiautoonoff`)
                        .setLabel("Sistema ON/OFF")
                        .setStyle(bot.get("semi") === true ? 3 : 4)
                        .setEmoji(emoji.ferra),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pixconfig`)
                        .setStyle(1)
                        .setLabel("Chave Pix")
                        .setEmoji(emoji.pix),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_qrcodeconfig`)
                        .setLabel("QrCode")
                        .setStyle(1)
                        .setEmoji(emoji.paleta),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_roleap`)
                        .setLabel("Cargo Aprovador")
                        .setStyle(1)
                        .setEmoji(emoji.livro)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_payments`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                    )
                ]
            })
        }

        function semiauto() {
            const role = interaction.guild.roles.cache.get(bot.get("semiauto.role")) || "`Não Definido`";
            let qrcode = "`Não Configurado`";
            if(bot.get("semiauto.qrcode").startsWith("https://")) {
                qrcode = `[QrCode](${bot.get("semiauto.qrcode")})`;
            }

            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.guild.name} | Configurar Semi-Automatico`)
                    .setDescription(`${emoji.ferra} | Sistema Semi-Automatico: ${bot.get("semi")}\n${emoji.pix} | Chave Pix: ${bot.get("semiauto.pix")} \n${emoji.paleta} | QrCode: ${qrcode}\n${emoji.livro} | Cargo Aprovador: ${role}`)   
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_semiautoonoff`)
                        .setLabel("Sistema ON/OFF")
                        .setStyle(bot.get("semi") === true ? 3 : 4)
                        .setEmoji(emoji.ferra),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pixconfig`)
                        .setStyle(1)
                        .setLabel("Chave Pix")
                        .setEmoji(emoji.pix),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_qrcodeconfig`)
                        .setLabel("QrCode")
                        .setStyle(1)
                        .setEmoji(emoji.paleta),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_roleap`)
                        .setLabel("Cargo Aprovador")
                        .setStyle(1)
                        .setEmoji(emoji.livro)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_payments`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                    )
                ]
            })
        }

        function mp() {
            interaction.update({
                content:"",
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.guild.name} | Configurar Mercado Pago`)
                    .setDescription(`${emoji.prancheta} | Acess Token: ||${bot.get("acesstoken")}|| \n${emoji.pix} | PIX: ${bot.get(`pix`) === true ? "Ativado": "Desativado"} \n${emoji.paleta} | QrCode: ${bot.get("qrcode") === true ? "Ativado" : "Desativado"}\n${emoji.chavefenda} | Pagar no Site: ${bot.get("pagarsite") === true ? "Ativado" : "Desativado"}`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_acesstoken_embed`)
                        .setLabel("Acess Token")
                        .setStyle(1)
                        .setEmoji(emoji.mercadopago),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pixonoff`)
                        .setStyle(bot.get("pix") === true ? 3 : 4)
                        .setLabel("PIX ON/OFF")
                        .setEmoji(emoji.pix),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_qrcode`)
                        .setStyle(bot.get("qrcode") === true ? 3 : 4)
                        .setLabel("QRCODE ON/OFF")
                        .setEmoji(emoji.paleta),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_pagarsite`)
                        .setStyle(bot.get("pagarsite") === true ? 3 : 4)
                        .setLabel("PAGAR NO SITE ON/OFF")
                        .setEmoji(emoji.pix),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_blockbank`)
                        .setStyle(1)
                        .setLabel("Bloquear Banco")
                        .setEmoji(emoji.banco),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_payments`)
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                    )
                ]
            })
        }
        function payments() {
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.guild.name} | Configurar Pagamentos`)
                    .setDescription(`Qual Formas de Pagamento você deseja Configurar?`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_mercadopago`)
                        .setLabel("Mercado Pago") 
                        .setEmoji(emoji.mercadopago)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_semiauto`)
                        .setStyle(1)
                        .setEmoji(emoji.dinheiro)
                        .setLabel("Semi-Automatico"),
                        new ButtonBuilder()
                        .setLabel("Voltar")
                        .setStyle(2)
                        .setEmoji(emoji.voltar)
                        .setCustomId(`${userid}_voltar`)
                    )
                ]
            })
        }
        function vendas() {
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setTitle(`${interaction.guild.name} | BotConfig`)
                    .setDescription(`Olá ***${interaction.user.username}*** Selecione abaixo qual opção você deseja configurar`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_vendasonoff`)
                        .setEmoji(emoji.cart)
                        .setLabel(`Vendas ${bot.get(`vendas`) === true ? "Online" : "Offline"}`)
                        .setStyle(bot.get(`vendas`) === true ? 3 : 4),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_payments`)
                        .setLabel("Configurar Pagamentos") 
                        .setEmoji(emoji.mao)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_roles`)
                        .setLabel("Configurar Cargo Cliente")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_channels`)
                        .setLabel("Configurar Canal Logs")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_categorys`)
                        .setLabel("Configurar Categoria Carrinho")
                        .setEmoji(emoji.engrenagem)
                        .setStyle(1),
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_channelspublic`)
                        .setEmoji(emoji.engrenagem)
                        .setLabel("Configurar Canal Publico")
                        .setStyle(1),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_terms`)
                        .setEmoji(emoji.papel)
                        .setLabel("Configurar Termos")
                        .setStyle(1),
                    )
                ]
            })
        }
    }}