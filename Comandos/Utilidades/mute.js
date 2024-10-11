const Discord = require("discord.js");
const config = require('../../config.json')
const ms = require("ms"); // Antes de executar o comando use "npm i pretty-ms ms"

module.exports = {
    name: "mute",
    description: "🦺 [ADM] Comando para Mutar um Membro",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "O usuário que você quer dar um mute.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "tempo",
            description: "Duração do mute (20s, 30m, 1h, 1day).",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "motivo",
            description: "O motivo para o mute.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
const { options, user } = interaction;
const member = options.getMember("membro");
const tempo = options.getString("tempo");
const milisec = ms(tempo);
const motivo = options.getString("motivo") || "Indefinido";

if (!milisec) {
  interaction.reply({
    ephemeral: true,
    content: `❌ Olá **${user.username}**, você não inseriu um tempo válido.`,
  });
} else {
  member
    .timeout(milisec, motivo)
    .then(() => {
      interaction.reply({
        content: `✅ Olá **${user.username}**, o membro ${member} foi castigado durante \`${tempo}\` com sucesso.`,
      });
    })
    .catch((err) => {
      interaction.reply({
        content: `❌ Olá **${user.username}**, não foi possível castigar o membro ${member} (${member.id}).`,
      });
    });
}
},
};

