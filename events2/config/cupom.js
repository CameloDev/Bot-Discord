const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");
const {owner} = require("../../token.json");
const { cupom} = require("../../database/index");
const emoji = require("../../emoji.json");




module.exports = {
    name:"interactionCreate",
    run:async(interaction, client) => {
        const {customId} = interaction;
        if(!customId) return;
        const userid = customId.split("_")[0];
        if(interaction.user.id !== userid) return;
        const c = customId.split("_")[1];

        if(customId.endsWith("_cupomminimo")) {
            const modal = new ModalBuilder()
            .setTitle("🔧 - Alterar Quantidade Minima")
            .setCustomId(`${userid}_${c}_cupomminimomodal`);
            
            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setRequired(true)
            .setLabel("Quantidade que será necessaria?")
            .setPlaceholder("10.00");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_cupomminimomodal")) {
            const text = parseFloat(interaction.fields.getTextInputValue("text")).toFixed(2);
            if(isNaN(text)) return interaction.reply({content:`${emoji.nao} | Coloque um valor valido`, ephemeral:true});
            if(text < 0.00) return interaction.reply({content:`${emoji.nao} | Coloque um valor acima de \`0.00\``, ephemeral:true});
            await cupom.set(`${c}.valormin`, Number(text));
            cece();
        }
        if(customId.endsWith("_cupomcargo")) {
            interaction.update({
                embeds:[
                    new EmbedBuilder()
                    .setDescription(`${emoji.lupa} | Escolha o novo cargo que será preciso!`)
                ],
                components:[
                    new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                        .setCustomId(`${userid}_${c}_rolecupom`)
                        .setPlaceholder("Escolha o Cargo")
                        .setMaxValues(1)
                        .setMinValues(1)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${c}_deleterolecupom`)
                        .setLabel("Remover Cargo")
                        .setStyle(4)
                        .setEmoji(emoji.aviso)
                    )
                ]
            });
        }
        if(customId.endsWith("_deleterolecupom")) {
            await cupom.set(`${c}.role`, "Não Configurado");
            cece();
        }
        if(customId.endsWith("_rolecupom")) {
            const id = interaction.values[0];
            await cupom.set(`${c}.role`, id);
            cece();
        }
        if(customId.endsWith("_cupomquantidade")) {
            const modal = new ModalBuilder()
            .setTitle("🔧 - Quantidade de Cupom")
            .setCustomId(`${userid}_${c}_quantiacupommodal`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setMaxLength(3)
            .setRequired(true)
            .setPlaceholder("10")
            .setLabel("Quantidade de Cupons");

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }
        if(customId.endsWith("_quantiacupommodal")) {
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) return interaction.reply({content:`${emoji.nao} | Coloque uma quantidade Valida!`, ephemeral:true});
            if(text < 0) return interaction.reply({content:`${emoji.nao} | Coloque um valor acima de \`0\``, ephemeral:true});
            await cupom.set(`${c}.quantidade`, Number(text));
            cece();
        }

        if(customId.endsWith("_cupomdeletar")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${c}_deletemodalkkkk123`)
            .setTitle("🔧 - Deletar Cupom");

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setLabel('Digite "sim"')
            .setPlaceholder("Maiusculo")
            .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(text));

            return interaction.showModal(modal);
        }

        if(customId.endsWith("_deletemodalkkkk123")) {
            const text = interaction.fields.getTextInputValue("text");
            if(text !== 'SIM') return interaction.reply({content:`${emoji.sim} | Cancelado com sucesso!`, ephemeral:true});
            await cupom.delete(c);
            interaction.update({
                content:`${emoji.sim} | Deletado com sucesso!`,
                embeds:[],
                components:[]
            });
        }
        if(customId.endsWith("_cupomporcentagem")) {
            const modal = new ModalBuilder()
            .setCustomId(`${userid}_${c}_cupomporcentagemmodal`)
            .setTitle(`🔧 - Alterar Porcentagem`);

            const text = new TextInputBuilder()
            .setCustomId("text")
            .setStyle(1)
            .setRequired(true)
            .setMaxLength(3)
            .setLabel("Coloque a porcentagem")
            .setPlaceholder("1 - 100");

            modal.addComponents(new ActionRowBuilder().addComponents(text));


            return interaction.showModal(modal);
        }

        if(customId.endsWith("_cupomporcentagemmodal")) {
            const text = parseInt(interaction.fields.getTextInputValue("text"));
            if(isNaN(text)) return interaction.reply({content:`${emoji.nao} | Coloque um valor valido!`, ephemeral:true});
            if(text < 1 || text > 100) return interaction.reply({content:`${emoji.nao} | Coloque entre \`1\` a \`100\``, ephemeral:true});
            await cupom.set(`${c}.porcentagem`, Number(text));
            cece();
        }


        async function cece() {
            const ce = await cupom.get(c);
        if(!ce) return interaction.reply({content:`${emoji.nao} | Não existe um cupom com este nome.`, ephemeral:true});
        const cargo = interaction.guild.roles.cache.get(ce.role) || "`Não Configurado`";
        interaction.update({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configurar Cupom`)
                .setDescription(`${emoji.lupa} | ID: \`${c}\`\n${emoji.caixa} | Porcentagem: \`${ce.porcentagem}\`\n${emoji.dinheiro} | Valor Minimo: \`R$${Number(ce.valormin).toFixed(2)}\`\n${emoji.livro} | Cargo: ${cargo}\n${emoji.nsei} | Quantidade: \`${ce.quantidade}\``)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${c}_cupomporcentagem`)
                    .setLabel("Porcentagem")
                    .setEmoji(emoji.caixa)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${c}_cupomminimo`)
                    .setLabel("Valor Minimo")
                    .setStyle(3)
                    .setEmoji(emoji.dinheiro),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${c}_cupomcargo`)
                    .setLabel("Cargo")
                    .setStyle(3)
                    .setEmoji(emoji.livro),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${c}_cupomquantidade`)
                    .setLabel("Quantidade")
                    .setStyle(3)
                    .setEmoji(emoji.nsei),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${c}_cupomdeletar`)
                    .setStyle(4)
                    .setEmoji(emoji.lixeira)
                    .setLabel("DELETAR")
                )
            ]
        });
        }
    }}