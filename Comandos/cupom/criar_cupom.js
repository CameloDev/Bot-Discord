const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const {owner} = require("../../token.json");
const emoji = require("../../emoji.json");
const { perm, db, cupom } = require("../../database/index");


module.exports = {
    name:"criar_cupom",
    description:"Crie um Cupom",
    type: ApplicationCommandType.ChatInput,
    options:[
        {
            name:"nome",
            description:"Coloque o Nome do Cupom",
            type: ApplicationCommandOptionType.String,
            required:true
        },
        {
            name:"porcentagem",
            description:"Coloque a porcentagem",
            type: ApplicationCommandOptionType.Number,
            required:true
        },
    ],
    run: async(client, interaction) => {
        const userid = interaction.user.id
        if(!await perm.get(`${userid}`)) return interaction.reply({content:`Você não tem permissão!`, ephemeral:true}); 
        const c = interaction.options.getString("nome");
        const porcentagem = interaction.options.getNumber("porcentagem");
        const ce = await cupom.get(c);
        if(ce) return interaction.reply({content:`${emoji.nao} | Já existe um cupom com este nome.`, ephemeral:true});
        await interaction.reply({content:`${emoji.carregar} | Aguarde um momento...`, ephemeral:true});
        await cupom.set(`${c}`, {
            valormin: 0.00,
            role: "Não Configurado",
            quantidade: 0,
            porcentagem
        });
        interaction.editReply({content:`${emoji.sim} | Cupom Criado com sucesso com o nome: \`${c}\``})
    }
}