const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db, db2 } = require("../../database/index");


module.exports = {
    name:"set_painel",
    description:"Sete um Painel",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"id",
            description:"Coloque o ID do Painel",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete:true
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

        await interaction.reply({
            content:`Aguarde um momento...`,
            ephemeral:true
        });
        const select = new StringSelectMenuBuilder()
        .setCustomId(`${id}_compra`)
        .setPlaceholder(`${p.placeholder}`)
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

        return await interaction.channel.send({
            embeds:[
                embed
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    select
                )
            ]
        }).then(async() => {

            interaction.editReply({
                content:`Setado com sucesso!`
            })
        })
    }
}