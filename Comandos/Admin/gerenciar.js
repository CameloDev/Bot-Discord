const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ApplicationCommandType } = require("discord.js");
const { JsonDatabase} = require("wio.db");
const db = new JsonDatabase({ databasePath:"./json/geral.json"});
const perm = new JsonDatabase({ databasePath:"./token.json"})

module.exports = {
    name:"gerenciar",
    description:"Execute para gerenciar o seu bot",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        const user1 = interaction.guild.members.cache.get(interaction.user.id);
        const roleIdToCheck = db.get(`roles`);
      
        const hasRequiredRole = roleIdToCheck.some(roleID => user1.roles.cache.has(roleID));
      
        if (!hasRequiredRole && interaction.user.id !== perm.get(`owner`)) { 
          await interaction.reply({content:'Você não tem permissão para usar este botão.', ephemeral: true});
          return;
        }


        
        interaction.reply({
            embeds:[
                new EmbedBuilder()
                .setTitle("***Seja Bem-Vindo a central de gerenciamento***")
                .setDescription(`⚠ Clique no *Menu* a baixo para iniciar a configuração do BOT ou gerenciar membros. \n\n \`❗ ATENÇÃO AS INFORMAÇÕES: ❗\` \n\n📝 As informações podem ser atualizadas a qualquer momento. \n\n❓ Caso tenha duvidas selecione o HELP do menu para obter ajuda.`)
            ],
            components:[
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .addOptions(
                        {
                            label:"Configurar Categorias",
                            value:"config_categorias",
                            emoji:"📝"
                        },
                        {
                            label:"Configurar Canais",
                            value:"config_canais",
                            emoji:"🔋"
                        },
                        {
                            label:"Configurar Cargos",
                            value:"config_roles",
                            emoji:"🦺"
                        },
                        {
                            label:"Configurar Bot",
                            value:"config_bot",
                            emoji:"🤖",
                            description:"Configure o bot ( Status, Foto, Nome )",
                        },
                        {
                            label:"Gerenciar Ticket",
                            value:"gerenciar_ticket",
                            emoji:"📊",
                            description:"Configure os horarios ( Horarios e etc )",
                        }
                    )
                    .setCustomId("gerenciarselect")
                    .setPlaceholder("▶ Selecione uma opção")
                    .setMaxValues(1)
                )
            ],
            ephemeral:true
        })
    }
}