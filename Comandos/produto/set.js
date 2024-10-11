const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db } = require("../../database/index");


module.exports = {
    name:"set",
    description:"Sete um Produto",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do produto",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete:true
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
        await interaction.reply({
            content:`Aguarde um momento...`,
            ephemeral:true
        });
        const embed = new EmbedBuilder()
        .setTitle(`${prod.title}`)
        .setDescription(`${prod.description} \n${emoji.planeta} **| Produto:** ${prod.nome} \n${emoji.dinheiro} **| Preço:** \`R$${Number(prod.preco).toFixed(2)}\`\n${emoji.caixa} **| Estoque:** \`${prod.conta.length}\``);

        if(prod.banner?.startsWith("https://")) {
            embed.setImage(prod.banner);
        }
        await interaction.channel.send({
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
        }).then(async() => {
            interaction.editReply({
                content:`Setado com sucesso!`
            })
        })
    }
}