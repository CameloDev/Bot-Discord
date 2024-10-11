const Discord = require("discord.js")
const config = require('../../config.json')

module.exports = {
  name: "unban", 
  description: "🦺 [ADM] Comando Desbanir Membro", 
  type:     Discord.ApplicationCommandType.ChatInput,
  options: [
    {
        name: "user",
        description: "Mencione um usuário para ser desbanido.",
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
        interaction.reply(`<a:1083893755905572904:1102594476876238870> Você não possui poermissão para utilizar este comando. <a:1083893755905572904:1102594476876238870>`);
    } else {
        let user = interaction.options.getUser("user");
        let motivo = interaction.options.getString("motivo");
        if (!motivo) motivo = "Não definido.";

        let embed = new Discord.EmbedBuilder()
        .setColor(config.embeds_color.embed_invisible)
        .setDescription(`**<a:giveway:1106223977774465134> | O usuário ${user} foi desbanido! Só espero que ele não quebre as regras novamente. <:a_morcego:1138267527370252348>**`);

        let erro = new Discord.EmbedBuilder()
        .setColor(config.embeds_color.embed_invisible)
        .setDescription(`<a:1083893755905572904:1102594476876238870> Não foi possível desbanir o usuário ${user} (\`${user.id}\`) do servidor! <a:1083893755905572904:1102594476876238870>`);

        interaction.guild.members.unban(user.id, motivo).then( () => {
            interaction.reply({ embeds: [embed] })
        }).catch(e => {
            interaction.reply({ embeds: [erro] })
        })
    }

  }
}