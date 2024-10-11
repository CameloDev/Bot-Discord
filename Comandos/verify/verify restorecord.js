const Discord = require("discord.js");
const config = require("../../config.json"); // Importa o arquivo de configuração

module.exports = {
    name: "verifyrestorecord",
    description: "Painel Verify Por restorecord",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const serverName = interaction.guild.name; // Obtém o nome do servidor
        const msg = `🔓 Verificação - ${serverName} \nSe Verifique Para poder visualizar o servidor`
        
        const imagem = `${config.painelrestorecord.urllogo}`

        const rowButtons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setLabel(`Verifique-se`)
                .setURL(config.client.linkrestorecord)
                .setStyle(5),
                new Discord.ButtonBuilder()
                .setLabel(`Por quer Se Verificar`)
                .setCustomId(`desc`)
                .setStyle(2)
            );

        interaction.channel.send({
            content: msg,
            files: [imagem],
            components: [rowButtons]
        });

        interaction.reply({
            content: `👋 | Painel enviado com sucesso.`,
            ephemeral: true
        });

        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton()) return;
            
            const buttonverify = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setLabel(`Verifique-se`)
                .setURL(config.painelrestorecord.linkrestorecord)
                .setStyle(5)
            );
            
            if (interaction.customId === "desc") {
                interaction.reply({
                    content: "**Para Liberar Canais e para podemos provar que você não é um bot**",
                    components: [buttonverify],
                    ephemeral: true
                });
            }
            
        });
    }
};
