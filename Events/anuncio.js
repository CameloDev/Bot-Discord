const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');
let embed = new EmbedBuilder()

module.exports = {
    name:"anuncio",
    async execute (interaction, client) {
        
        if(interaction.customId === "titulo_anuncio"){
            const modal = new ModalBuilder()
            .setCustomId("titulo_anuncio_modal")
            .setTitle("Title")

            const text = new TextInputBuilder()
            .setCustomId("text_titulo")
            .setLabel("Qual seria o titulo?")
            .setStyle(1)
            .setRequired(true)

            modal.addComponents(new ActionRowBuilder().addComponents(text))

            await interaction.showModal(modal);
        }
    
    if(interaction.isModalSubmit() && interaction.customId === "titulo_anuncio_modal"){
        interaction.deferUpdate()
        const text = interaction.fields.getTextInputValue("text_titulo")

        embed.setTitle(`${text}`)
    }

    
        
    if(interaction.customId === "desc_anuncio"){
        const modal = new ModalBuilder()
        .setCustomId("desc_anuncio_modal")
        .setTitle("Description")

        const text = new TextInputBuilder()
        .setCustomId("text_desc")
        .setLabel("Qual seria a Descrição?")
        .setStyle(2)
        .setRequired(true)

        modal.addComponents(new ActionRowBuilder().addComponents(text))

        await interaction.showModal(modal);
    }

if(interaction.isModalSubmit() && interaction.customId === "desc_anuncio_modal"){
    interaction.deferUpdate()
    const text = interaction.fields.getTextInputValue("text_desc")

    embed.setDescription(`${text}`)
}



        
if(interaction.customId === "imagem_anuncio"){
    const modal = new ModalBuilder()
    .setCustomId("imagem_anuncio_modal")
    .setTitle("Image")

    const text = new TextInputBuilder()
    .setCustomId("text_imagem")
    .setLabel("Qual seria a Imagem?")
    .setStyle(1)
    .setRequired(true)

    modal.addComponents(new ActionRowBuilder().addComponents(text))

    await interaction.showModal(modal);
}

if(interaction.isModalSubmit() && interaction.customId === "imagem_anuncio_modal"){
interaction.deferUpdate()
const text = interaction.fields.getTextInputValue("text_imagem")
try{
    embed.setImage(`${text}`) 
} catch{
    interaction.channel.send({content:"erro"})
}
}


        
if(interaction.customId === "miniatura_anuncio"){
    const modal = new ModalBuilder()
    .setCustomId("miniatura_anuncio_modal")
    .setTitle("Miniatura")

    const text = new TextInputBuilder()
    .setCustomId("text_miniatura")
    .setLabel("Qual seria a miniatura?")
    .setStyle(1)
    .setRequired(true)

    modal.addComponents(new ActionRowBuilder().addComponents(text))

    await interaction.showModal(modal);
}

if(interaction.isModalSubmit() && interaction.customId === "miniatura_anuncio_modal"){
interaction.deferUpdate()
const text = interaction.fields.getTextInputValue("text_miniatura")

try {
    
embed.setThumbnail(`${text}`)
} catch {
    interaction.channel.send({
        content:"Erro"
    })
}
}


        
if(interaction.customId === "author_anuncio"){
    const modal = new ModalBuilder()
    .setCustomId("author_anuncio_modal")
    .setTitle("Author")

    const text = new TextInputBuilder()
    .setCustomId("text_author")
    .setLabel("Qual seria o author?")
    .setStyle(1)
    .setRequired(true)

    modal.addComponents(new ActionRowBuilder().addComponents(text))

    await interaction.showModal(modal);
}

if(interaction.isModalSubmit() && interaction.customId === "author_anuncio_modal"){
interaction.deferUpdate()
const text = interaction.fields.getTextInputValue("text_author")

embed.setAuthor({name:`${text}`})
}


        
if(interaction.customId === "rodape_anuncio"){
    const modal = new ModalBuilder()
    .setCustomId("rodape_anuncio_modal")
    .setTitle("Rodapé")

    const text = new TextInputBuilder()
    .setCustomId("text_rodape")
    .setLabel("Qual seria o Rodapé?")
    .setStyle(1)
    .setRequired(true)

    modal.addComponents(new ActionRowBuilder().addComponents(text))

    await interaction.showModal(modal);
}

if(interaction.isModalSubmit() && interaction.customId === "rodape_anuncio_modal"){
interaction.deferUpdate()
const text = interaction.fields.getTextInputValue("text_rodape")

embed.setFooter({text:`${text}`})
}


        
if(interaction.customId === "cor_anuncio"){
    const modal = new ModalBuilder()
    .setCustomId("cor_anuncio_modal")
    .setTitle("Title")

    const text = new TextInputBuilder()
    .setCustomId("text_cor")
    .setLabel("Qual seria a cor? em hexadecimal")
    .setStyle(1)
    .setRequired(true)

    modal.addComponents(new ActionRowBuilder().addComponents(text))

    await interaction.showModal(modal);
}

if(interaction.isModalSubmit() && interaction.customId === "cor_anuncio_modal"){
interaction.deferUpdate()
const text = interaction.fields.getTextInputValue("text_cor")

embed.setColor(`${text}`)
}


if(interaction.customId == "data_anuncio") {
    interaction.deferUpdate()
    embed.setTimestamp()
}

if(interaction.customId == "preview_anuncio") { 
   try {
    interaction.reply({
        embeds:[
            embed
        ],
        ephemeral:true
       })
   } catch{
    interaction.reply({content:" ❌ | Houve um problema para processar"})
   }

}
if(interaction.customId === "cancelar_anuncio") {
    interaction.message.delete()
    embed = new EmbedBuilder()
}

if(interaction.isButton()) {
    const customId = interaction.customId
    const id = customId.split("_")[0];
    const channel = interaction.guild.channels.cache.get(id)
    if(!channel) return;

    if(customId.endsWith("_enviar_anuncio")) {
        channel.send({
            embeds:[
                embed
            ]
        }).then(() => { 
            embed = new EmbedBuilder()
            interaction.update({
                content:"Enviado com sucesso",
                embeds:[],
                components:[]
            })
        })
    }


    
}


}}
