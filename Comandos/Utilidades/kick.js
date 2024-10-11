const dc = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'kick',
    description: '🦺 [ADM] Comando de Expulsar Membros',
    type: 1,
    options: [{name: 'membro', type: 6, description: 'Coloque um usuário.', requiBlue: true},
    {name: 'motivo', type: 3, description: 'Coloque um motivo.', requiBlue: false, max_lenght: 200 }], //Máximo de 200 Caracteres;
    default_member_permissions: `0x0000000000000002`, //Caso a pessoa não tenha a perm, o comando não irá aparecer;

    run: async (client, interaction) => {

        const { options, user } = interaction;
        const member = options.getMember("membro");
        const reason = interaction.options.getString("motivo") || "Indefinido";
    
        member
          .kick(reason)
          .then(() => {
            interaction.reply({
              content: `✅ Olá **${user.username}**, o membro ${member} foi expulso com sucesso.`,
            });
          })
          .catch((err) => {
            interaction.reply({
              content: `❌ Olá **${user.username}**, não foi possível expulsar o membro ${member} do servidor.`,
            });
          });
      },
    };

