const Discord = require('discord.js')
const config = require('../../config.json')
const token = require('../../token.json')

module.exports = {
    name: 'botconfigmod',
    description: '🦺 [ADM] Gerenciar seu Bot',

    run: async (client, interaction) => {

        if (interaction.user.id != `${token.owner}`) { 
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`${interaction.user.tag}, Você não tem permissão para usar este comando.`)
                        .setColor(config.embeds_color.embed_invisible)
                        .setTimestamp()
                ],
                ephemeral: true,
            })
        } else {

            interaction.reply({
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("alterar_username")
                                .setLabel("Alterar Nome do Bot")
                                .setEmoji("1111484562548211712")
                                .setStyle(Discord.ButtonStyle.Secondary),
                                new Discord.ButtonBuilder()
                                    .setCustomId("alterar_avatar")
                                    .setLabel("Alterar Avatar do Bot")
                                    .setEmoji("1111484562548211712")
                                    .setStyle(Discord.ButtonStyle.Secondary),
                                        new Discord.ButtonBuilder()
                                            .setCustomId("configavan")
                                            .setLabel("Configurações avançadas")
                                            .setEmoji("1111484562548211712")
                                            .setStyle(Discord.ButtonStyle.Secondary),
                        )
                ],
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`*Painel de Configuração do Bot`)
                        .setDescription(` \`\`\`
Painel para mudar meu perfil:

Botão de Mudar Avatar do Bot, para mudar o avatar do seu bot usando o URL do avatar em um modal.

Botão de mudar o Nome do Bot, para mudar o nome do seu bot em um modal.
\`\`\`
[Clique aqui](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0) para pegar meu invite.`)
                        .setColor(config.embeds_color.embed_invisible)
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dinamyc: true }) })
                ],
                ephemeral: true,
            })
        }
    }
}