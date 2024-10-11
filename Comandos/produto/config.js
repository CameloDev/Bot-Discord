const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db } = require("../../database/index");


module.exports = {
    name:"config",
    description:"Configure um Produto",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do produto",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete: true,
        }
    ],
    
    async autocomplete(interaction) {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = db.all();
    
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
        const prod = await db.get(`${id}`);
        if(!prod) return interaction.reply({content:`Não existe um produto com este ID`, ephemeral:true});
        let banner = "`Não Configurado`";
        if(prod.banner.startsWith("https://")) {
            banner = `[Banner](${prod.banner})`
        } 
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle(`${interaction.guild.name} | Configurar Produto`)
                .setDescription(`**Titulo Atual:** ${prod.title} \n\n**Descrição Atual:** ${prod.description} \n\n${emoji.lupa} | ID: ${id} \n${emoji.etiqueta} | Nome do Produto: ${prod.nome}\n${emoji.dinheiro} | Preço: ${Number(prod.preco).toFixed(2)} \n${emoji.paleta} | Banner: ${banner}`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_titleprod`)
                    .setLabel(`TITULO`)
                    .setEmoji(emoji.ferra)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_nomeprod`)
                    .setLabel(`NOME`)
                    .setEmoji(emoji.planeta)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_descprod`)
                    .setLabel(`DESCRIÇÃO`)
                    .setEmoji(emoji.papel)
                    .setStyle(3),
                    new ButtonBuilder()
                    .setEmoji(emoji.dinheiro)
                    .setCustomId(`${userid}_${id}_precoprod`)
                    .setLabel(`PREÇO`)
                    .setStyle(3),
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_bannerprod`)
                    .setLabel("Configurar Banner")
                    .setEmoji(emoji.paleta)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_stockprod`)
                    .setLabel("Configurar estoque")
                    .setEmoji(emoji.caixa)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId(`${userid}_${id}_deleteprod`)
                    .setLabel("DELETAR")
                    .setEmoji(emoji.lixeira)
                    .setStyle(4)
                )
            ]
        })
    }}