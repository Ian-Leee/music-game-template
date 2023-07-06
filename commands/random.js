const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Client,
} = require("discord.js");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Play a random song in our database!"),
    execute(client, interaction) {
        if (!interaction.member.voice.channel)
            return interaction.reply("You need to in a voice channel");
        const data = fs.readFileSync("songs.json");
        const songs = JSON.parse(data);
        const songId = Math.floor(Math.random() * songs.length);
        const songName = songs[songId].name;
        const songLink = songs[songId].link;
        const random1 = Math.floor(Math.random() * songs.length);
        const songName1 = songs[random1].name;
        const random2 = Math.floor(Math.random() * songs.length);
        const songName2 = songs[random2].name;
        const random3 = Math.floor(Math.random() * songs.length);
        const songName3 = songs[random3].name;
        const songEmbed = new EmbedBuilder()
            .setTitle("Music")
            .setDescription(`猜歌名`);

        const buttonA = new ButtonBuilder()
            .setCustomId("answer")
            .setLabel(` ${songName}`)
            .setStyle(ButtonStyle.Primary);

        const buttonB = new ButtonBuilder()
            .setCustomId("testB")
            .setLabel(` ${songName1}`)
            .setStyle(ButtonStyle.Primary);

        const buttonC = new ButtonBuilder()
            .setCustomId("testC")
            .setLabel(` ${songName2}`)
            .setStyle(ButtonStyle.Primary);

        const buttonD = new ButtonBuilder()
            .setCustomId("testD")
            .setLabel(` ${songName3}`)
            .setStyle(ButtonStyle.Primary);
        const randomButton = Math.floor(Math.random() * 4+1);
        let buttonRow;
        if(randomButton == 1){
            buttonRow = new ActionRowBuilder().addComponents(buttonA, buttonB, buttonC, buttonD);
        }
        if(randomButton == 2){
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonA,  buttonC, buttonD);
        }
        if(randomButton == 3){
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonC, buttonA,  buttonD);
        }
        if(randomButton == 4){
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonC, buttonD, buttonA);
        }

        const collectorA = interaction.channel.createMessageComponentCollector({ time: 200000 });

        interaction.reply({ embeds: [songEmbed], components: [buttonRow] });
        client.distube.play(interaction.member.voice.channel, songLink, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
        });

        collectorA.on("collect", (collected) => {
            let victory = 0;
            if (collected.customId === "answer") {
                victory = 1;
            }
            if (victory) {
                console.log("win");
            } else {
                console.log("lost");
            }
            if(victory == 1){
                collected.reply({ content: "WIN"});
            }else{collected.reply({ content: "LOSE"});}
            client.distube.stop(interaction.member.voice.channel);
            collectorA.stop();
        });
    },
};
