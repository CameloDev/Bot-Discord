const Discord = require("discord.js")
const config = require('../../config.json')

module.exports = {
  name: "ban", 
  description: "🦺 [ADM] Comando de Banir Membros", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "user",
        description: "Mencione um usuário para ser banido.",
        type: Discord.ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "motivo",
        description: "Insira um motivo.",
        type: Discord.ApplicationCommandOptionType.String,
        required: false,
    }
],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
        interaction.reply(`<a:1083893755905572904:1102594476876238870> Você não possui poermissão para utilizar este comando.`);
    } else {
        const userr = interaction.options.getUser("user");
        const user = interaction.guild.members.cache.get(userr.id)
        const motivo = interaction.options.getString("motivo") || `Banido por ${interaction.user.username}`;

        interaction.reply({
          content: `✅ Olá **${interaction.user.username}**, O usuário ${user} foi punido com sucesso. Ninguém mandou quebrar as regras, seu troxa! `,
        });

        const embed = new Discord.EmbedBuilder()
        .setColor(config.embeds_color.embed_invisible)
        .setDescription(`**<a:giveway:1106223977774465134> | O usuário ${user} foi punido com sucesso. Ninguém mandou quebrar as regras, seu troxa! <:a_morcego:1138267527370252348>**`);

        const erro = new Discord.EmbedBuilder()
        .setColor(config.embeds_color.embed_invisible)
        .setDescription(`<a:1083893755905572904:1102594476876238870> Não foi possível banir o usuário ${user} (\`${user.id}\`) do servidor!`);

        user.ban({ reason: [motivo] }).then( () => {
            interaction.channel.send({ embeds: [embed] })
        }).catch(e => {
          console.log(e)
            interaction.channel.send({ embeds: [erro] })
        })
    }

  }
}