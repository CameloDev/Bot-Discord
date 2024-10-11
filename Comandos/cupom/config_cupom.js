const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db, cupom } = require("../../database/index");


module.exports = {
    name:"config_cupom",
    description:"Configure um Cupom",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"nome",
            description:"Coloque o Nome do Cupom",
            type: ApplicationCommandOptionType.String,
            required:true,
            autocomplete:true
        }
    ],
    async autocomplete(interaction) {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = cupom.all();
    
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
        const c = interaction.options.getString("nome");
        const ce = await cupom.get(c);
        if(!ce) return interaction.reply({content:`${emoji.nao} | Não existe um cupom com este nome.`, ephemeral:true});
        const cargo = interaction.guild.roles.cache.get(ce.role) || "`Não Configurado`";
        interaction.reply({
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
}