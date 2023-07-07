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
        .setName("guess")
        .setDescription("Guess a song from our database!"),
    execute(client, interaction) {
        if (!interaction.member.voice.channel)
            return interaction.reply("You need to in a voice channel");
        const data = fs.readFileSync("songs.json");
        const songs = JSON.parse(data);
        let songId = Math.floor(Math.random() * songs.length);
        const songName = songs[songId].name;
        const songLink = songs[songId].link;
        let random1 = Math.floor(Math.random() * songs.length);
        let random2 = Math.floor(Math.random() * songs.length);
        let random3 = Math.floor(Math.random() * songs.length);
        while (
            songId == random1 ||
            songId == random2 ||
            songId == random3 ||
            random1 == random2 ||
            random1 == random3 ||
            random2 == random3
        ) {
            random1 = Math.floor(Math.random() * songs.length);
            random2 = Math.floor(Math.random() * songs.length);
            random3 = Math.floor(Math.random() * songs.length);
        }
        const songName1 = songs[random1].name;
        const songName2 = songs[random2].name;
        const songName3 = songs[random3].name;
        const songEmbed = new EmbedBuilder().setTitle("Music").setDescription(`猜歌名`);

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
        const randomButton = Math.floor(Math.random() * 4 + 1);
        let buttonRow;
        if (randomButton == 1) {
            buttonRow = new ActionRowBuilder().addComponents(buttonA, buttonB, buttonC, buttonD);
        }
        else if (randomButton == 2) {
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonA, buttonC, buttonD);
        }
        else if (randomButton == 3) {
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonC, buttonA, buttonD);
        }
        else (randomButton == 4) {
            buttonRow = new ActionRowBuilder().addComponents(buttonB, buttonC, buttonD, buttonA);
        }

        const collectorA = interaction.channel.createMessageComponentCollector({ time: 200000 });

        interaction.reply({ embeds: [songEmbed], components: [buttonRow] });
        let queue = client.distube.getQueue(interaction.guild.id);
        if (queue) client.distube.stop(interaction.member.voice.channel);
        client.distube.play(interaction.member.voice.channel, songLink, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction,
        });

        collectorA.on("collect", (collected) => {
            collected.update({ embeds: [songEmbed], components: [] });
            let victory = 0;
            let result;
            const jsonDataIn = fs.readFileSync("point.json");
            let players = JSON.parse(jsonDataIn);
            if (collected.customId === "answer") {
                victory = 1;
            }
            let earnings;
            if (victory == 1) {
                earnings = 2;
                result = new EmbedBuilder()
                    .setTitle("WIN!!!")
                    .setImage(
                        "https://cdn.discordapp.com/attachments/1125656497108549714/1126701371316514886/YOU_WIN.gif",
                    );
            } else {
                earnings = -1;
                result = new EmbedBuilder()
                    .setTitle("LOSE!!!")
                    .setImage(
                        "https://cdn.discordapp.com/attachments/1125656497108549714/1126703373933101087/YOU_WIN.png",
                    );
            }
            let found = false;
            for (let i = 0; i < players.length; i++) {
                //如果有就修改該玩家的 money 並回覆結果
                if (players[i].id == interaction.user.id) {
                    found = true;
                    players[i].point += earnings;
                    result.setDescription(`結果：${earnings}分\n你現在有 ${players[i].point} 分!`);
                }
            }
            if (found == false) {
                //創建新的玩家資料
                players.push({ id: interaction.user.id, point: earnings });
                result.setDescription(`結果：${earnings}分\n你現在有 ${earnings} 分!`);
            }
            interaction.followUp({ embeds: [result] });
            client.distube.stop(interaction.member.voice.channel).catch((err) => {
                console.log(err);
            });
            const jsonDataOut = JSON.stringify(players);
            fs.writeFileSync("point.json", jsonDataOut);
            collectorA.stop();
        });
    },
};
/*
const jsonDataIn = fs.readFileSync("point.json");
let players = JSON.parse(jsonDataIn);
let found = false;
for (let i = 0; i < players.length; i++) {
    //如果有就修改該玩家的 money 並回覆結果
    if (players[i].id == interaction.user.id) {
        found = true;
        players[i].point += earnings;

        //回復結果
        const diceEmbed = new EmbedBuilder()
            .setColor("#5865F2")
            .setDescription(`結果：${earnings}分\n你現在有 ${players[i].point} 分!`);
        interaction.reply({ embeds: [diceEmbed] });
        break;
    }
}

//如果沒有資料就創建一個新的並回覆結果
if (found == false) {
    //創建新的玩家資料
    players.push({ id: interaction.user.id, point: 0 });

    //回復結果
    const diceEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setDescription(`結果：${earnings}分\n你現在有 ${earnings} 分!`);
    interaction.reply({ embeds: [diceEmbed] });
}

//stringify players 並存回 players.json
const jsonDataOut = JSON.stringify(players);
fs.writeFileSync("point.json", jsonDataOut);

*/
