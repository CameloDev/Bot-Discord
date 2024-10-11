const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Discord = require("discord.js")

module.exports = {
    name: "lock",
    description: "Trancar Canais",
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({content: 'sem permissão'});

        const botao = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('Desbloquear1')
                    .setEmoji("🔒")
                    .setLabel('Desbloquear')
                    .setStyle(ButtonStyle.Secondary),
                );
let embed = new EmbedBuilder()
.setDescription(`⭐ Esse canal foi bloqueado por \`${interaction.user.username}\`.`)     
.setColor('#438ad2')  
interaction.reply({embeds: [embed], components: [botao]}).then(msg => {

    interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).catch(o => {
        console.log(o)
        interaction.reply({ content: `Error`})
    })

});  
const colector = interaction.channel.createMessageComponentCollector();

colector.on("collect", (ni) =>{
if(ni.user.id !== interaction.user.id){
ni.reply({content: "**❌ Você não Tem permissão para destrancar esse canal**", ephemeral: true})
} else{
ni.channel.permissionOverwrites.edit(ni.guild.id, { SendMessages: true})
ni.reply({content: `**Canal destrancado com sucesso ${interaction.user}**`, ephemeral: false})
}
})
}
}