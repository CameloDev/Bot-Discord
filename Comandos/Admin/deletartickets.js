const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const {JsonDatabase} = require("wio.db");
const token = require("../../token.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    name:"deletartickets",
    description:"[👑 / Only Owner] Execute o Comando de deletar TODOS os Tickets",
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => {
        if(interaction.user.id !== token.owner) return interaction.reply({content:`❌ | Você não tem permissão para executar este comando!`, ephemeral:true});
        await interaction.reply({content:`🔁 | Aguarde um momento estou deletando todos os ticket's....`, ephemeral:true});
        var channels_ticket = await interaction.guild.channels.cache.filter(c => c.name.includes('🎫・'));

        channels_ticket.forEach(async element => {
            element = await element
            element.delete()
        });


        var channels_ticket_closed = await interaction.guild.channels.cache.filter(c => c.name.includes('⛔・'));

        channels_ticket_closed.forEach(async element => {
            element = await element
            element.delete()
        });

        var channels_ticket_call = await interaction.guild.channels.cache.filter(c => c.name.includes('📞・'));

        channels_ticket_call.forEach(async element => {
            element = await element
            element.delete()
        });

        await db.deleteAll();

        return interaction.editReply({content:`✅ | Todos os Tickets Foram Deletados com sucesso`})
    }
}