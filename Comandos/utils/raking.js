const { ApplicationCommandType, EmbedBuilder } = require("discord.js");
const {JsonDatabase} = require("wio.db");
const db = new JsonDatabase({databasePath:"./json/ass"});
const db1 = new JsonDatabase({ databasePath:"./json/geral.json"});
const perm = new JsonDatabase({ databasePath:"./token.json"})


module.exports ={ 
    name:"ranking",
    description:"Veja o ranking de ticket assumidos",
    type:ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db1.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole && interaction.user.id !== perm.get(`owner`)) { 
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }


        const data = db.all().sort((a, b) => b.data - a.data).slice(0, 10);
        
        let description = '*Este é o ranking de atendimento staff os 10 staff\'s com maior colocação estarão nesse ranking*\n';
        data.forEach((item, index) => {
            description += `\n\`${index + 1}°\` <@${item.ID}> \`${item.ID}\`・Ticket's Atendidos: \`${item.data}\``;
        });

        const embed = new EmbedBuilder()
            .setTitle('`🏆 RANKING ATENDIMENTO TICKET`')
            .setDescription(description);

        interaction.reply({
            embeds: [embed],
            ephemeral:true
        });
    }
}
