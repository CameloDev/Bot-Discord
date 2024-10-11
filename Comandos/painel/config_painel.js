const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db, db2 } = require("../../database/index");


module.exports = {
    name:"config_painel",
    description:"Configure um Painel",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do Painel",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        },
    ],
    async autocomplete(interaction) {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = db2.all()
    
        const filtered = choices.filter(choice => choice.ID.toLowerCase().includes(value)).slice(0, 25);
    
        if(!interaction) return;
        if(!await perm.get(`${interaction.user.id}`)){
          await interaction.respond([
              { name: "Você não tem permissão para usar esse comando!", value: "vcnaotempermlolkkkkk" }
          ]);
        } else if(choices.length === 0){ 
            await interaction.respond([
                { name: "Você não tem nenhum produto criado!", value: "a22139183954312asd92384XASDASDSADASDSADASDASD12398212222" }
            ]);
        } else if(filtered.length === 0) {
            await interaction.respond([
                { name: "Não Encontrei esse produto", value: "a29sad183912a213sd92384XASDASDSADASDSADASDASD1239821" }
            ]);
        } else {
            await interaction.respond(
                filtered.map(choice => ({ name: `ID - ${choice.ID}`, value: choice.ID}))
            );
        }
  
    },  
    run: async(client, interaction) => {
        const userid = interaction.user.id
        if(!await perm.get(`${userid}`)) return interaction.reply({content:`Você não tem permissão!`, ephemeral:true});
        const id = interaction.options.getString("id");
        const p = await db2.get(`${id}`);
        if(!p) return interaction.reply({content:`Não Existe um Painel com este ID`, ephemeral:true});
        let banner = "`Sem Banner`"
        if(p.banner?.startsWith("https://")) {
            banner = `[Banner](${p.banner})`
        }
        const embed = new EmbedBuilder()
        .setTitle(`${interaction.guild.name} | Configurar Painel`)
        .setThumbnail(interaction.guild.iconURL())
        .setDescription(`**Descrição Atual:**\n ${p.desc} \n\n🔎 | ID: ${id}\n${emoji.chavefenda} | Titulo: ${p.title} \n${emoji.ferra} | PlaceHolder: ${p.placeholder}\n${emoji.paleta} | ${banner} \n\n **TODOS OS PRODUTOS:**\n`);
        await p.produtos.map((a) => {
            embed.addFields({
                name:`Produto ID:`,
                value:`${a}`,
                inline:true
            })
        });
        interaction.reply({
            embeds:[
                embed
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_addproductpainel`)
                        .setLabel("ADICIONAR PRODUTO")
                        .setEmoji(emoji.mais)
                        .setDisabled(p.produtos.length > 24)
                        .setStyle(3),
                        new ButtonBuilder()
                        .setCustomId(`${userid}_${id}_removeproductpainel`)
                        .setLabel("REMOVER PRODUTO")
                        .setEmoji(emoji.menos)
                        .setDisabled(p.produtos.length <= 1)
                        .setStyle(2),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_titlepainel`)
                    .setLabel("Alterar Titulo")
                    .setStyle(1)
                    .setEmoji(emoji.engrenagem),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_descpainel`)
                    .setLabel("Alterar Descrição")
                    .setStyle(1)
                    .setEmoji(emoji.engrenagem),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_placeholderpainel`)
                    .setLabel("Alterar PlaceHolder")
                    .setStyle(1)
                    .setEmoji(emoji.engrenagem),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_bannerpainel`)
                    .setLabel("Alterar Banner")
                    .setStyle(1)
                    .setEmoji(emoji.engrenagem),
                )
            ]
        })
    }}