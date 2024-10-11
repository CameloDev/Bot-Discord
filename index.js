const {Client, Partials, GatewayIntentBits, InteractionType, Collection, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, PermissionFlagsBits, ButtonStyle, ActivityType, WebhookClient} = require("discord.js")

const config = require("./config.json")


const Discord = require('discord.js')
const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  32767
  
] });

const { QuickDB } = require('quick.db');
const db = new QuickDB();
const ms = require("ms")
const {JsonDatabase} = require("wio.db")
const db2 = new JsonDatabase({databasePath:"./json/system.json"})
const palavras = new JsonDatabase({databasePath:"./json/palavras_feias.json"})
const linksblock = new JsonDatabase({databasePath:"./json/linksblock.json"})

module.exports = client;
client.commands = new Discord.Collection();
client.slashCosmmands = new Discord.Collection();
client.config = require("./config.json");
require("./handler")(client);
const db1 = new JsonDatabase({databasePath:"./config.json"})



module.exports = client

client.setMaxListeners(20); // Não trocar isso, so se for adicionar mais comandos, cada 1 comando adicione 1+





client.on('interactionCreate', (interaction) => {

  if(interaction.type === InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})


client.on("ready", () => {
  console.log(`👋 Feito Por Camelo`);
  console.log(`👋 Credito para o: Infinity7, discord.gg/reatss `);
  console.log(`🤖 Meu nome e ${client.user.username}`);
  console.log(`💔 O seu server tem ${client.users.cache.size} pessoas`);
  console.log(`👨 Eu estou em ${client.guilds.cache.size} servers`);

  setInterval(() => {

    console.clear();

      console.log(`👋 Feito Por Camelo`);
    console.log(`👋 Credito para o: infinity7, discord.gg/reactss `);
    console.log(`🤖 Meu nome e ${client.user.username}`);
    console.log(`💔 O seu server tem ${client.users.cache.size} pessoas`);
    console.log(`👨 Eu estou em ${client.guilds.cache.size} servers`);
  }, 5000);
});






client.slashCommands = new Collection()

require('./handler')(client)
client.on("interactionCreate", require('./Events/gerenciar').execute);
client.on("interactionCreate", require('./Events/ticket').execute);
client.on("interactionCreate", require('./Events/button').execute);
client.on("interactionCreate", require('./Events/anuncio').execute);
client.on("interactionCreate", require('./Events/avaliar').execute)


const evento = require("./handler/Events2");

evento.run(client);

require("./handler/index2")(client);

const {token} = require("./token.json")
client.login(token)


const axios = require("axios")
const url = 'https://discord.com/api/v10/applications/@me';


const data = {
  description: "<a:money:1181552777323892769> **V3 Feito Por Camelo \n\n qualquer bug contate: camelo_000 para tentamos resolver da melhor maneira possivel**",
};

axios.patch(url, data, {
  headers: {
    Authorization: `Bot ${token}`,
    'Content-Type': 'application/json'
  } 
})


.then((response) => {
  console.log('Aplicação atualizada com sucesso!');
})
.catch((error) => {
  console.error(`Erro ao atualizar aplicação: ${error}`);
});

process.on('unhandRejection', (reason, promise) => {

  console.log(`🚫 Erro Detectado:\n\n` + reason, promise)

});

process.on('uncaughtException', (error, origin) => {

  console.log(`🚫 Erro Detectado:\n\n` + error, origin)
  
});





  
  
  client.login((config.client.token));
  /*============================= | RESPOSTA MENÇÃO | =========================================*/
  
  client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.includes(`<@${client.user.id}>`)) {
      message.channel.send("Ola, Use /botconfig para me configurar");
    }
  });
  
  
  /*============================= | configbot | =========================================*/
  
  
  client.on("interactionCreate", async(interaction) => {
  
    if(interaction.isButton() && interaction.customId === "configavan") {
  
      interaction.update({
        embeds:[
          new Discord.EmbedBuilder()
          .setDescription(`Altere os dados logo abaixo! \n\n Canal de avaliação: <#${await db1.get(`avaliar_staff`)}> \n __Os Botões dê entrada logo abaixo!__`)
          .setColor("Blue")
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`),
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`),
    
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`),
          ),
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId("bemvindo1")
            .setLabel("Mudar Botão 1")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo2")
            .setLabel("Mudar Botão 2")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo3")
            .setLabel("Mudar Botão 3")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("chatavaliation")
            .setLabel("Mudar Canal de avaliação")
            .setStyle(2),
          )
        ]
      })
    }
  
    if(interaction.isButton() && interaction.customId === "bemvindo1"){
  
      const modal = new Discord.ModalBuilder()
      .setTitle("Configuração do Bem Vindo 1")
      .setCustomId("bemvindo1_modal")
  
      const label = new Discord.TextInputBuilder()
      .setCustomId("label")
      .setLabel("Alterar Label do Botão")
      .setRequired(true)
      .setStyle(1)
      .setMaxLength(25)
  
      const emoji = new Discord.TextInputBuilder()
      .setCustomId("emoji")
      .setLabel("Alterar emoji do Botão")
      .setRequired(true)
      .setStyle(1)
  
      const link = new Discord.TextInputBuilder()
      .setCustomId("link")
      .setLabel("Alterar link do Botão")
      .setRequired(true)
      .setStyle(1)
  
      modal.addComponents(new ActionRowBuilder().addComponents(label))
  
      modal.addComponents(new ActionRowBuilder().addComponents(emoji))
  
      modal.addComponents(new ActionRowBuilder().addComponents(link))
  
      return interaction.showModal(modal)
  
    }
  
  
    if(interaction.isButton() && interaction.customId === "bemvindo2"){
    const modal = new Discord.ModalBuilder()
      .setTitle("Configuração do Bem Vindo 2")
      .setCustomId("bemvindo2_modal")
  
      const label = new Discord.TextInputBuilder()
      .setCustomId("label")
      .setLabel("Alterar Label do Botão")
      .setRequired(true)
      .setStyle(1)
      .setMaxLength(25)
  
      const emoji = new Discord.TextInputBuilder()
      .setCustomId("emoji")
      .setLabel("Alterar emoji do Botão")
      .setRequired(true)
      .setStyle(1)
  
      const link = new Discord.TextInputBuilder()
      .setCustomId("link")
      .setLabel("Alterar link do Botão")
      .setRequired(true)
      .setStyle(1)
  
      modal.addComponents(new ActionRowBuilder().addComponents(label))
  
      modal.addComponents(new ActionRowBuilder().addComponents(emoji))
  
      modal.addComponents(new ActionRowBuilder().addComponents(link))
  
      return interaction.showModal(modal)
  
  
    }
  
  
    if(interaction.isButton() && interaction.customId === "bemvindo3"){
  
      const modal = new Discord.ModalBuilder()
      .setTitle("Configuração do Bem Vindo 3")
      .setCustomId("bemvindo3_modal")
  
      const label = new Discord.TextInputBuilder()
      .setCustomId("label")
      .setLabel("Alterar Label do Botão")
      .setRequired(true)
      .setStyle(1)
      .setMaxLength(25)
  
      const emoji = new Discord.TextInputBuilder()
      .setCustomId("emoji")
      .setLabel("Alterar emoji do Botão")
      .setRequired(true)
      .setStyle(1)
  
      const link = new Discord.TextInputBuilder()
      .setCustomId("link")
      .setLabel("Alterar link do Botão")
      .setRequired(true)
      .setStyle(1)
  
      modal.addComponents(new ActionRowBuilder().addComponents(label))
  
      modal.addComponents(new ActionRowBuilder().addComponents(emoji))
  
      modal.addComponents(new ActionRowBuilder().addComponents(link))
  
      return interaction.showModal(modal)
  
  
    }
  
    if(interaction.isModalSubmit() && interaction.customId === "bemvindo1_modal") {
      const label = interaction.fields.getTextInputValue("label")
      const emoji = interaction.fields.getTextInputValue("emoji")
      const link = interaction.fields.getTextInputValue("link")
  
      db1.set(`bemvindo.botões.botão1.label`,label)
      db1.set(`bemvindo.botões.botão1.emoji`,emoji)
      db1.set(`bemvindo.botões.botão1.link`, link)
  
      interaction.update({
        embeds:[
          new Discord.EmbedBuilder()
          .setDescription(`Altere os dados logo abaixo! \n\n Canal de avaliação: <#${await db1.get(`avaliar_staff`)}> \n __Os Botões dê entrada logo abaixo!__`)
          .setColor("Blue")
        ],
  
        components: [
          new ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`),
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`),
    
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`),
          ),
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId("bemvindo1")
            .setLabel("Mudar Botão 1")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo2")
            .setLabel("Mudar Botão 2")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo3")
            .setLabel("Mudar Botão 3")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("chatavaliation")
            .setLabel("Mudar Canal de avaliação")
            .setStyle(2),
          )
        ]
      })
  
  
    }
  
  
  
    if(interaction.isModalSubmit() && interaction.customId === "bemvindo3_modal") {
      const label = interaction.fields.getTextInputValue("label")
      const emoji = interaction.fields.getTextInputValue("emoji")
      const link = interaction.fields.getTextInputValue("link")
  
      db1.set(`bemvindo.botões.botão3.label`,label)
      db1.set(`bemvindo.botões.botão3.emoji`,emoji)
      db1.set(`bemvindo.botões.botão3.link`, link)
  
      interaction.update({
        embeds:[
          new Discord.EmbedBuilder()
          .setDescription(`Altere os dados logo abaixo! \n\n Canal de avaliação: <#${await db1.get(`avaliar_staff`)}> \n __Os Botões dê entrada logo abaixo!__`)
          .setColor("Blue")
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`),
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`),
    
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`),
          ),
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId("bemvindo1")
            .setLabel("Mudar Botão 1")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo2")
            .setLabel("Mudar Botão 2")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo3")
            .setLabel("Mudar Botão 3")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("chatavaliation")
            .setLabel("Mudar Canal de avaliação")
            .setStyle(2),
          )
        ]
      })
  
  
    }
  
  
  
  
    if(interaction.isModalSubmit() && interaction.customId === "bemvindo2_modal") {
      const label = interaction.fields.getTextInputValue("label")
      const emoji = interaction.fields.getTextInputValue("emoji")
      const link = interaction.fields.getTextInputValue("link")
  
      db1.set(`bemvindo.botões.botão2.label`,label)
      db1.set(`bemvindo.botões.botão2.emoji`,emoji)
      db1.set(`bemvindo.botões.botão2.link`, link)
  
      interaction.update({
        embeds:[
          new Discord.EmbedBuilder()
          .setDescription(`Altere os dados logo abaixo! \n\n Canal de avaliação: <#${await db1.get(`avaliar_staff`)}> \n __Os Botões dê entrada logo abaixo!__`)
          .setColor("Blue")
        ],
        components: [
          new ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`),
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`),
    
    new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`),
          ),
          new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
            .setCustomId("bemvindo1")
            .setLabel("Mudar Botão 1")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo2")
            .setLabel("Mudar Botão 2")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("bemvindo3")
            .setLabel("Mudar Botão 3")
            .setStyle(2),
            new ButtonBuilder()
            .setCustomId("chatavaliation")
            .setLabel("Mudar Canal de avaliação")
            .setStyle(2),
          )
        ]
      })
  
  
    }
  
  
    if(interaction.isButton() && interaction.customId === "chatavaliation"){
  
      const modal = new Discord.ModalBuilder()
      .setTitle("Configuração do canal de avaliação")
      .setCustomId("modal_avaliar_config")
  
      const label = new Discord.TextInputBuilder()
      .setCustomId("id")
      .setLabel("Qual é o id do canal?")
      .setRequired(true)
      .setStyle(1)
      modal.addComponents(new ActionRowBuilder().addComponents(label))
  
      return interaction.showModal(modal)
  
  
    }
  
    if(interaction.isModalSubmit() && interaction.customId === "modal_avaliar_config") {
      const chan = interaction.fields.getTextInputValue("id")
      const channel = client.channels.cache.get(chan) 
  
      if(!channel) {
        interaction.reply({
          content:"Escolha id de um canal!",
          ephemeral:true
        })
      } else {
        db1.set(`avaliar_staff`, chan)
  
        interaction.update({
          embeds:[
            new Discord.EmbedBuilder()
            .setDescription(`Altere os dados logo abaixo! \n\n Canal de avaliação: <#${await db1.get(`avaliar_staff`)}> \n __Os Botões dê entrada logo abaixo!__`)
            .setColor("Blue")
          ],
          components: [
            new ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()  
      .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
      .setStyle("Link")
      .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
      .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`),
      new Discord.ButtonBuilder()  
      .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
      .setStyle("Link")
      .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
      .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`),
      
      new Discord.ButtonBuilder()  
      .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
      .setStyle("Link")
      .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
      .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`),
            ),
            new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
              .setCustomId("bemvindo1")
              .setLabel("Mudar Botão 1")
              .setStyle(2),
              new ButtonBuilder()
              .setCustomId("bemvindo2")
              .setLabel("Mudar Botão 2")
              .setStyle(2),
              new ButtonBuilder()
              .setCustomId("bemvindo3")
              .setLabel("Mudar Botão 3")
              .setStyle(2),
              new ButtonBuilder()
              .setCustomId("chatavaliation")
              .setLabel("Mudar Canal de avaliação")
              .setStyle(2),
            )
          ]
        })
  
  
      }
    }
  
  
  })
  
  
  /*============================= | FORMULARIO | =========================================*/
   
   client.on("interactionCreate", async(interaction) => {
     if (interaction.isButton()) {
       if (interaction.customId === "formulario") {
         if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
         const modal = new Discord.ModalBuilder()
         .setCustomId("modal")
         .setTitle("Formulário"); 
   
         const pergunta1 = new Discord.TextInputBuilder()
         .setCustomId("pergunta1") // Coloque o ID da pergunta
         .setLabel("Qual e seu nome/sobrenome?") // Coloque a pergunta
         .setMaxLength(20) // Máximo de caracteres para a resposta
         .setPlaceholder("Nome/Sobrenome") // Mensagem que fica antes de escrever a resposta
         .setRequired(true) // Deixar para responder obrigatório (true | false)
         .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
   
         const pergunta2 = new Discord.TextInputBuilder()
         .setCustomId("pergunta2") // Coloque o ID da pergunta
         .setLabel("Qual e sua idade?") // Coloque a pergunta
         .setMaxLength(2) // Máximo de caracteres para a resposta
         .setPlaceholder("Idade") // Mensagem que fica antes de escrever a resposta
         .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
         .setRequired(true)
   
         const pergunta3 = new Discord.TextInputBuilder()
         .setCustomId("pergunta3") // Coloque o ID da pergunta
         .setLabel("Qual e seu horario disponivel?") // Coloque a pergunta
         .setPlaceholder("Manhã/Tarde/Noite/Madrugada") // Mensagem que fica antes de escrever a resposta
         .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
         .setRequired(true)
   
         const pergunta4 = new Discord.TextInputBuilder()
         .setCustomId("pergunta4") // Coloque o ID da pergunta
         .setLabel("Porque devemos te aceitar na STAFF?") // Coloque a pergunta
         .setMaxLength(1000)
         .setPlaceholder("Motivo") // Mensagem que fica antes de escrever a resposta
         .setStyle(Discord.TextInputStyle.Paragraph) // Tipo de resposta (Short | Paragraph)
         .setRequired(true)
   
   
         modal.addComponents(
           new Discord.ActionRowBuilder().addComponents(pergunta1),
           new Discord.ActionRowBuilder().addComponents(pergunta2),
           new Discord.ActionRowBuilder().addComponents(pergunta3),
           new Discord.ActionRowBuilder().addComponents(pergunta4)
   
         )
   
         await interaction.showModal(modal)
       }
     } else if (interaction.isModalSubmit()) {
       if (interaction.customId === "modal") {
         const resposta1 = interaction.fields.getTextInputValue("pergunta1")
         const resposta2 = interaction.fields.getTextInputValue("pergunta2")
         const resposta3 = interaction.fields.getTextInputValue("pergunta3")
         const resposta4 = interaction.fields.getTextInputValue("pergunta4")
   
   
         if (!resposta1) resposta1 = "Não informado."
         if (!resposta2) resposta2 = "Não informado."
         if (!resposta3) resposta3 = "Não informado."
         if (!resposta4) resposta4 = "Não informado."
   
   
         const embed = new Discord.EmbedBuilder()
         .setColor("303136")
         .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
         .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
         .setDescription(`**Usuario:** ${interaction.user}\n**ID:** \`${interaction.user.id}\``)
         .addFields(
           {
             name: `Nome`,
             value: `\`\`\`${resposta1}\`\`\``,
             inline: true
           },
           {
             name: `Idade`,
             value: `\`\`\`${resposta2}\`\`\``,
             inline: true
           },
           {
             name: `Horarios`,
             value: `\`\`\`${resposta3}\`\`\``,
             inline: true
           },
           {
             name: `Motivo`,
             value: `\`\`\`${resposta4}\`\`\``,
             inline: false
           }
         );
   
         interaction.reply({ embeds: [ new Discord.EmbedBuilder().setDescription(`**${interaction.user},** Seu formulário foi enviado com sucesso. Aguarde a resposta no seu privado!`)
                   .setColor("303136")
           ],
           ephemeral: true,
       })
         await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
       }
     }
   })
  
  
  /*============================= | SISTEMA BEM-VINDO| =========================================*/
  
  client.slashCommands = new Discord.Collection()
  require('./handler')(client)
  
  client.on("guildMemberAdd", async (member) => {
    const canal_logs = (config.bemvindo.logs);
    if (!canal_logs) return;
  
    const trm = new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão1.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão1.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão1.link`)}`)
  
    const trm2 = new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão2.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão2.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão2.link`)}`)
  
    const trm3 = new Discord.ButtonBuilder()  
    .setLabel(`${await db1.get(`bemvindo.botões.botão3.label`)}`)
    .setStyle("Link")
    .setEmoji(`${await db1.get(`bemvindo.botões.botão3.emoji`)}`)
    .setURL(`${await db1.get(`bemvindo.botões.botão3.link`)}`)
  
  
  
  
    const arrow = new Discord.ActionRowBuilder()
    .addComponents(trm, trm2, trm3)
  
  
    const embed = new Discord.EmbedBuilder()
    .setColor(config.embeds_color.embed_invisible)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(config.client.barrinha)
    .setTitle(`${config.bemvindo.name} - Boas Vindas `)
    .setDescription(`**Bem vindo ao nosso servidor!**\nEvite quebrar as nossas diretrizes.\n\n- 👤Usuário: ${member}\n- 🆔ID do usuário: ${member.id}\n- ⭐Membros atualmente: ${member.guild.memberCount} membros.`);
    member.guild.channels.cache.get(config.bemvindo.logs).send({ embeds: [embed], components: [arrow] })
  })
  
  /*============================= | BOT CONFIG | =========================================*/
  
  
  client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("alterar_username")) {
        const modal_bot_config_nome = new Discord.ModalBuilder()
          .setCustomId('modal_bot_config_nome')
          .setTitle(`Altere informações do bot abaixo.`)
        const nome_bot = new Discord.TextInputBuilder()
          .setCustomId('username_bot')
          .setLabel('Digite o nome do bot.')
          .setPlaceholder('Escreva o nome aqui.')
          .setStyle(Discord.TextInputStyle.Short)
  
        const firstActionRow = new Discord.ActionRowBuilder().addComponents(nome_bot);
        modal_bot_config_nome.addComponents(firstActionRow)
        await interaction.showModal(modal_bot_config_nome);
      }
    }
  
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("alterar_avatar")) {
        const modal_bot_config_avatar = new Discord.ModalBuilder()
          .setCustomId('modal_bot_config_avatar')
          .setTitle(`Altere informações do bot abaixo.`)
        const avatar_bot_modal = new Discord.TextInputBuilder()
          .setCustomId('bot_avatar')
          .setLabel('URL do avatar.')
          .setPlaceholder('URL aqui')
          .setStyle(Discord.TextInputStyle.Short)
        const SecondActionRow = new Discord.ActionRowBuilder().addComponents(avatar_bot_modal)
        modal_bot_config_avatar.addComponents(SecondActionRow)
        await interaction.showModal(modal_bot_config_avatar);
      }
    }
    //
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'modal_bot_config_nome') {
      const nome_bot = interaction.fields.getTextInputValue('username_bot');
  
      await interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(config.embeds_color.embed_invisible)
            .setDescription(`**${interaction.user.tag},** Alterei o meu nome para:`)
            .addFields(
              {
                name: `\\🌟 Nome alterado para:`,
                value: `\`\`\`fix\n${nome_bot}\n\`\`\``,
              },
            )
            .setTimestamp()
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
        ]
      })
      interaction.client.user.setUsername(nome_bot)
    }
    //
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'modal_bot_config_avatar') {
      const avatar_bot = interaction.fields.getTextInputValue('bot_avatar');
  
      interaction.reply({
        ephemeral: true,
        embeds: [
          new Discord.EmbedBuilder()
            .setColor(config.embeds_color.embed_invisible)
            .setDescription(`**${interaction.user.tag},** Alterei o meu avatar para:`)
            .setImage(avatar_bot)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dinamyc: true }) })
        ]
      })
      interaction.client.user.setAvatar(avatar_bot)
    }
  })
  
  
  /*============================= | PAINEL ENCOMENDAR | =========================================*/
  
  client.on("interactionCreate", async(interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "painel_encomendar") {
      if (!interaction.guild.channels.cache.get(await db.get(`canal_encomendar_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
      const modal = new Discord.ModalBuilder()
      .setCustomId("modal_encomendar")
      .setTitle("*Encomendar*");
  
      const pergunta1 = new Discord.TextInputBuilder()
      .setCustomId("pergunta1") 
      .setLabel("Qual produto vc deseja?") 
      .setMaxLength(30) 
      .setPlaceholder("Sua resposta") 
      .setRequired(true) 
      .setStyle(Discord.TextInputStyle.Short) 
  
      const pergunta2 = new Discord.TextInputBuilder()
      .setCustomId("pergunta2") 
      .setLabel("Quantas unidades vc deseja?") 
      .setMaxLength(30) 
      .setPlaceholder("Sua resposta") 
      .setStyle(Discord.TextInputStyle.Short) 
      .setRequired(true)
  
      const pergunta3 = new Discord.TextInputBuilder()
      .setCustomId("pergunta3") 
      .setLabel("Deseja deixar alguma observação?") 
      .setPlaceholder("Sua resposta") 
      .setStyle(Discord.TextInputStyle.Paragraph) 
      .setRequired(true)
  
      modal.addComponents(
        new Discord.ActionRowBuilder().addComponents(pergunta1),
        new Discord.ActionRowBuilder().addComponents(pergunta2),
        new Discord.ActionRowBuilder().addComponents(pergunta3)
      )
  
      await interaction.showModal(modal)
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modal_encomendar") {
      const resposta1 = interaction.fields.getTextInputValue("pergunta1")
      const resposta2 = interaction.fields.getTextInputValue("pergunta2")
      const resposta3 = interaction.fields.getTextInputValue("pergunta3")
      const data24 = Math.floor(+new Date() / 1000);
  
      const data_compra = `<t:${data24}:f>`;
  
      const passado_compra = `<t:${data24}:R>`;
  
      if (!resposta1) resposta1 = "Não informado."
      if (!resposta2) resposta2 = "Não informado."
      if (!resposta3) resposta3 = "Não informado."
  
      const embed = new Discord.EmbedBuilder()
      .setColor(config.embeds_color.embed_invisible)
      .setDescription(`**:bust_in_silhouette: | O usuário ${interaction.user} enviou um pedido abaixo**`)
      .addFields(
        {
          name: `:shopping_cart: | Produto Desejado`,
          value: ` \`${resposta1}\``,
          inline: false
        },
        {
          name: `📦 | Quantidade Desejada`,
          value: ` \`${resposta2}\``,
          inline: false
        },
        {
          name: `:grey_exclamation: | Observação`,
          value: ` \`${resposta3}\``,
          inline: false
        },
        {
          name: `📅 | Data/Horário:`,
          value: `${data_compra} (${passado_compra})`,
          inline: false
        },
      );
  
      interaction.reply({ content: `Olá **${interaction.user.username}**, seu pedido foi enviada com sucesso! ❤`, ephemeral: true})
      await interaction.guild.channels.cache.get(await db.get(`canal_encomendar_${interaction.guild.id}`)).send({ embeds: [embed] })
    }
  }
  })
  
  
  /*============================= | PAINEL AVALIAÇÕES | =========================================*/
  
  client.on("interactionCreate", async(interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "painel_avaliação") {
      if (!interaction.guild.channels.cache.get(await db.get(`canal_avaliação_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
      const modal = new Discord.ModalBuilder()
      .setCustomId("modalaval")
      .setTitle("*Avaliação*");
  
      const pergunta1 = new Discord.TextInputBuilder()
      .setCustomId("pergunta4") 
      .setLabel("De uma nota de 0/10 para seu item/atendimento") 
      .setMaxLength(30) 
      .setPlaceholder("Resposta aqui!") 
      .setRequired(true) 
      .setStyle(Discord.TextInputStyle.Short) 
  
      const pergunta2 = new Discord.TextInputBuilder()
      .setCustomId("pergunta5") 
      .setLabel("Descreva sua experiencia com a nossa loja") 
      .setMaxLength(30) 
      .setPlaceholder("Resposta aqui!") 
      .setStyle(Discord.TextInputStyle.Short) 
      .setRequired(true)
  
      modal.addComponents(
        new Discord.ActionRowBuilder().addComponents(pergunta1),
        new Discord.ActionRowBuilder().addComponents(pergunta2),
      )
  
      await interaction.showModal(modal)
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "modalaval") {
      const resposta4 = interaction.fields.getTextInputValue("pergunta4")
      const resposta5 = interaction.fields.getTextInputValue("pergunta5")
      const data24 = Math.floor(+new Date() / 1000);
  
      const data_compra = `<t:${data24}:f>`;
  
      const passado_compra = `<t:${data24}:R>`;
  
      if (!resposta4) resposta4 = "Não informado."
      if (!resposta5) resposta5 = "Não informado."
  
      const embed = new Discord.EmbedBuilder()
      .setColor(config.embeds_color.embed_invisible)
      .setTitle("💓 | Nova Avaliação")
      .addFields(
        {
          name: `👥 | Avaliação Enviada Por:`,
          value: ` <@${interaction.user.id}>`,
          inline: false
        },
        {
          name: `⭐ | Nota para o produto/atendimento:`,
          value: ` \`${resposta4}\``,
          inline: false
        },
        {
          name: `✨ | Feedback da loja:`,
          value: `${resposta5}`,
          inline: false
        },
        {
          name: `📅 | Data/Horário:`,
          value: `${data_compra} (${passado_compra})`,
          inline: false
        },
      );
  
      interaction.reply({ content: `Olá **${interaction.user.username}**, sua avaliação foi enviada com sucesso! ❤`, ephemeral: true})
      await interaction.guild.channels.cache.get(await db.get(`canal_avaliação_${interaction.guild.id}`)).send({ embeds: [embed] })
    }
  }
  })
  
  /*============================= | RESPOSTA MENÇÃO | =========================================*/
  
  client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.includes(`<@${client.user.id}>`)) {
      message.channel.send("Marca não, filho da puta! To batendo punheta!");
    }
  });
  
  
  
  
  client.on("interactionCreate", async interaction => {
    if(interaction.isStringSelectMenu() && interaction.customId === "gerenciar_select") {
      const options = interaction.values[0]
  
      if(options === "channel_logs"){
        const modal = new ModalBuilder()
        .setTitle("Canal de logs")
        .setCustomId("modal_channel_logs");
  
        const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Qual será o canal de logs")
            .setPlaceholder("Coloque o id!")
            .setStyle(1)
            .setValue(interaction.channel.id)
            .setRequired(true);
  
                modal.addComponents(new ActionRowBuilder().addComponents(text));
  
  
    return interaction.showModal(modal);
      }
  
  
  
  
      if(options === "palavras_block"){
        const modal = new ModalBuilder()
        .setTitle("Bloqueador de Palavra")
        .setCustomId("modal_palavra_block");
  
        const text = new TextInputBuilder()
            .setCustomId("text")
            .setLabel("Qual será a palavra bloqueada?")
            .setPlaceholder("Exemplo: porra")
            .setStyle(1)
            .setRequired(true);
  
            const mute = new TextInputBuilder()
                .setCustomId("mute")
                .setLabel("Quanto tempo de mute em segundos")
                .setPlaceholder("Exemplo: 12 ")
                .setStyle(1)
                .setRequired(true);
  
                modal.addComponents(new ActionRowBuilder().addComponents(text));
  
                modal.addComponents(new ActionRowBuilder().addComponents(mute));
  
    return interaction.showModal(modal);
      }
  
  
  
  
      if(options === "links_remove"){
        
        const modal = new ModalBuilder()
        .setTitle("Bloqueador de link")
        .setCustomId("modal_link_block")
  
        const text = new TextInputBuilder()
        .setCustomId("text")
        .setLabel("Qual será o link bloqueada?")
        .setPlaceholder("Exemplo: discord.com")
        .setStyle(1)
        .setRequired(true)
  
        modal.addComponents(new ActionRowBuilder().addComponents(text))
  
        return interaction.showModal(modal)
      }
  
      if(options === "ant_alts"){
  
  
        const modal = new ModalBuilder()
        .setTitle("Bloqueador de alts")
        .setCustomId("modal_alts_block")
  
        const text = new TextInputBuilder()
        .setCustomId("text")
        .setLabel("Quantos dias será o minimo?")
        .setPlaceholder("Exemplo: 7")
        .setStyle(1)
        .setMaxLength(2)
        .setRequired(true)
  
        modal.addComponents(new ActionRowBuilder().addComponents(text))
  
        return interaction.showModal(modal)
  
  
  
      }
  
      if(options === "debug"){
  
        interaction.update({content:`${interaction.user}`})
  
      }
  
     
    };
  
    if(interaction.isModalSubmit() && interaction.customId === "modal_palavra_block") {
      const text = interaction.fields.getTextInputValue("text")
      const mute = interaction.fields.getTextInputValue("mute")
      if (!isNaN(mute)) {
        db2.set(`automod.mute`, mute);
  
        palavras.push(`palavras`, `${text}`)
  
        interaction.reply({content:`A Palavra ${text} Foi Adicionado com sucesso!`, ephemeral:true})
  
    } else {
        interaction.reply({ content: "Por favor, insira um número válido.", ephemeral:true });
    }
  
  
    };
  
    if(interaction.isModalSubmit() && interaction.customId === "modal_channel_logs") {
      const text = interaction.fields.getTextInputValue("text")
      db2.set(`automod.canal_de_logs`, text);
      interaction.reply({content:`O Canal <#${text}> Foi Adicionado com sucesso!`, ephemeral:true})
  
    };
  
    if(interaction.isModalSubmit() && interaction.customId === "modal_link_block") {
      const text = interaction.fields.getTextInputValue("text")
      linksblock.push(`links`, `${text}`)
      interaction.reply({content:`O Link ${text} Foi Adicionado com sucesso!`, ephemeral:true})
  
    };
  
    if (interaction.isModalSubmit() && interaction.customId === "modal_alts_block") {
      const text = interaction.fields.getTextInputValue("text");
      
      if (!isNaN(text)) {
          db2.set(`automod.days`, text);
          interaction.reply({ content: `O tempo foi definido para: ${text} Dias`, ephemeral:true });
      } else {
          interaction.reply({ content: "Por favor, insira um número válido.", ephemeral:true });
      }
  };
  
  
    if(interaction.isStringSelectMenu() && interaction.customId === "ativaction"){
  
      const options = interaction.values[0]
      
  
      if(options === "system_on_off"){
  
        
        switch (await db2.get(`automod.ligado`)) {
          case true: {
            await db2.set(`automod.ligado`, false)
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            
            break;
        
          default: {
            await db2.set(`automod.ligado`, true)
  
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            break;
        }
  
  
      }
  
      if(options === "palavras_on_off"){
  
        
        switch (await db2.get(`automod.systems.palavras`)) {
          case true: {
            await db2.set(`automod.systems.palavras`, false)
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            
            break;
        
          default: {
            await db2.set(`automod.systems.palavras`, true)
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            break;
        }
  
  
      }
  
  
      if(options === "links_on_off"){
  
  
        switch (await db2.get(`automod.systems.linkblock`)) {
          case true: {
            await db2.set(`automod.systems.linkblock`, false)
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            
            break;
        
          default: {
            await db2.set(`automod.systems.linkblock`, true)
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            break;
        }
  
  
      }
  
      if(options === "alt_on_off"){
  
  
        switch (await db2.get(`automod.systems.ant_alt`)) {
          case true: {
            await db2.set(`automod.systems.ant_alt`, false)
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            
            break;
        
          default: {
            await db2.set(`automod.systems.ant_alt`, true)
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            break;
        }
  
  
  
      }
  
      if(options === "ping_on_off"){
  
  
        switch (await db2.get(`automod.systems.ant_ping`)) {
          case true: {
            await db2.set(`automod.systems.ant_ping`, false)
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            
            break;
        
          default: {
            await db2.set(`automod.systems.ant_ping`, true)
  
  
  
            interaction.update({
              embeds:[
              new EmbedBuilder()
              .setTitle(`Sistema está: ${await db2.get(`automod.ligado`) === true ? "Ligado" : "Desligado"}`)
              .setDescription(`🔞** | Palavras Feias: ${await db2.get(`automod.systems.palavras`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n ❌ | ** Links Bloqueados: ${await db2.get(`automod.systems.linkblock`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``} ** \n2️⃣ **| Ant-Alt: ${await db2.get(`automod.systems.ant_alt`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** \n2️⃣ **| Ant-Ping: ${await db2.get(`automod.systems.ant_ping`) === true ? `\`Esta Ativado!\``: `\`Está Desativado!\``}** `)
          ],
            })
          }
            break;
        }
  
  
  
      }
  
    }
  
  
  });
  
  client.on("guildMemberAdd", async (member) => {
    const systemon = await db2.get(`automod.ligado`)
  
    if(systemon === true) {
      if (!member.guild) return;
      if (member.user.bot) return;
    
      const times2 = await db2.get(`automod.days`)
      const guild = member.guild;
      const timeSpan = ms(`${times2} days`);
  
  
      if(await db2.get(`automod.systems.ant_alt`) === true) {
  
        const createdAt = new Date(member.user.createdAt).getTime();
                  const difference = Date.now() - createdAt;
                  if (difference < timeSpan) {
                      member.send({
                          embeds: [
                              new EmbedBuilder()
                                  .setTitle("__Kickado__")
                                  .setDescription("Você foi kickado por está com conta alt!")
                                  .setColor("Default")
                                  .setFooter({
                                      text: `Volte Quando tiver com ${times2} de conta criada!`,
                                  })
                          ]
                      }).then(() => {
                          member.kick("Conta alt");
                      });
  
                      try {
                        guild.channels.cache.get(await db2.get(`automod.canal_de_logs`)).send({
                            embeds: [
                                new EmbedBuilder()
                                    .setDescription(`${member} foi kickado por está com uma conta menos de ${times2} Dias!`)
                            ]
                        })
                    } catch (error) {
                        return;
                    }
    
                  }
  
                  
  
  
      } else {
        return
      }
  
  
    } else {
      return;
    }
  
  });
  
  
  
  
  
  client.on("messageCreate", async (message) => {
    const systemon = await db2.get(`automod.ligado`)
  
    if(systemon === true) {
      if (!message.guild) return;
      if (message.author.bot) return;
      if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  
  
  
      if(await db2.get(`automod.systems.linkblock`) === true) {
  
       
        const ragex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
        const guild = message.guild
        if (ragex.test(message.content)) {
          try {
              await message.delete();
          } catch (error) {
              return;
          }
  
          const msg = await message.channel.send({ embeds: [new EmbedBuilder().setColor('8d99ae').setDescription(`\`🔗\` | ${message.author} Não envie Links!`)] });
          setTimeout(async () => {
              await msg.delete();
          }, 5000);
  
          try {
            
              guild.channels.cache.get(await db2.get(`automod.canal_de_logs`)).send({
                  embeds: [
                      new EmbedBuilder()
                          .setDescription(`O Usuario: ${message.author}, Enviou um link: \n\`\`\`${message.content}\`\`\``)
                  ]
              });
          } catch (error) {
              return;
          }
      }
  
  
      } else {
        return
      }
  
  
    } else {
      return;
    }
  
  });
  
  
  
  
  
  client.on("messageCreate", async (message) => {
    const systemon = await db2.get(`automod.ligado`)
  
    if(systemon === true) {
      if (!message.guild) return;
      if (message.author.bot) return;
      if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  
  
  
      if(await db2.get(`automod.systems.palavras`) === true) {
        const Swearlinks = palavras.get(`palavras`)
  
  
  
        for (let i in Swearlinks) {
  
          if (message.content.toLowerCase().includes(Swearlinks[i].toLowerCase())) {
              try {
                  await message.delete();
              } catch (error) {
                  return;
              }
              
          const guild = message.guild;
  
              const buttons = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                      .setLabel("Mutar Usuario")
                      .setEmoji("⚒️")
                      .setCustomId("timeout")
                      .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                      .setLabel("Kick")
                      .setEmoji("🔨")
                      .setCustomId("kick")
                      .setStyle(ButtonStyle.Danger)
              );
  
              const msg = await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`\`📛\` | ${message.author} Você enviou uma palavra não apropriada.`)] });
              setTimeout(async () => {
                  await msg.delete();
              }, 5000);
  
              try {
                  const text = await guild.channels.cache.get(await db2.get(`automod.canal_de_logs`)).send({
                      embeds: [
                          new EmbedBuilder()
                              .setDescription(`${message.author} Usou uma das mensagens programadas para ser bloqueadas!.\n\`\`\`${message.content}\`\`\``)
                      ],
                      components: [buttons]
                  });
  
                  const col = text.createMessageComponentCollector();
                  col.on("collect", async (m) => {
                      const ms = require("ms");
                      switch (m.customId) {
                          case "timeout":
                              if (
                                  !m.member.permissions.has(PermissionFlagsBits.ModerateMembers)
                              )
                                  return m.reply({
                                      content: "Não tenho permissão para dar mute!",
                                      ephemeral: true,
                                  });
                              const embed = new EmbedBuilder()
                                  .setTitle("Timeout")
                                  .setDescription(
                                      `Você foi mutado no servidor: \`${message.guild.name}\`, Motivo: Envio de palavras inapropriadas!`
                                  )
  
                              m.message.edit({ components: [] });
  
                              m.reply({
                                  content: `Usuario: ${message.author.tag} tomou mute de:  ${await db2.get(`automod.mute`)} segundos`,
                                  ephemeral: true,
                              });
  
                              message.member
                                  .send({
                                      embeds: [embed],
                                  })
                                  .then(async() => {
                                      const time = ms(`${await db2.get(`automod.mute`)} Seconds`);
                                      message.member.timeout(time);
                                  });
                              break;
                          case "kick":
                              if (!m.member.permissions.has(PermissionFlagsBits.KickMembers))
                                  return m.reply({
                                      content: "Não tenho permissão para dar kick",
                                      ephemeral: true,
                                  });
                              const embedss = new EmbedBuilder()
                                  .setTitle("Kicked")
                                  .setDescription(
                                      `Você foi kickado do servidor: \`${message.guild.name}\` Por palavra Inapropriadas!`
                                  )
  
                              m.message.edit({ components: [] });
  
                              m.reply({
                                  content: `Foi Kickado: ${message.author.tag}`,
                                  ephemeral: true,
                              });
  
                              message.member
                                  .send({
                                      embeds: [embedss],
                                  })
                                  .then(() => {
                                      message.member.kick({ reason: "Enviando palavras inapropriadas!" });
                                  });
                              break;
                      }
                  });
              } catch (error) {
                  return;
              }
          }
  
      }
  
  } else {
        return
      }
  
  
    } else {
      return;
    }
  
  });
  
  
  
  
  
  client.on("messageCreate", async (message) => {
    const systemon = await db2.get(`automod.ligado`)
  
    if(systemon === true) {
      if (!message.guild) return;
      if (message.author.bot) return;
      if (message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  
  
  
      const guild = message.guild
      if(await db2.get(`automod.systems.ant_ping`) === true) {
  
        if (message.content == "@everyone") {
          try {
              await message.delete();
          } catch (error) {
              return;
          }
  
          const msg = await message.channel.send({ embeds: [new EmbedBuilder().setDescription(`\`📌\` | ${message.author} Não Pingue Everyone!.`)] });
          setTimeout(async () => {
              await msg.delete();
          }, 5000);
  
          try {
              guild.channels.cache.get(await db2.get(`automod.canal_de_logs`)).send({
                  embeds: [
                      new EmbedBuilder()
                          .setColor('8ecae6')
                          .setDescription(`${message.author} Pingou Everyone\n\`\`\`${message.content}\`\`\``)
                  ]
              });
          } catch (error) {
              return;
          }
      }
        
  
  
      } else {
        return
      }
  
  
    } else {
      return;
    }
  
  });
  
  

  