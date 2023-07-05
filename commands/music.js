const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, embedLength } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder().setName("random").setDescription("Replies with pong!"),
    async execute(client, interaction) {
        if (!interaction.member.voice.channel)
            return interaction.reply("You need to in a voice channel");
        const data = fs.readFileSync('songs.json');
        const songs = JSON.parse(data);
        const songId = Math.floor(Math.random() * songs.length);
        const songName = songs[songId].name;
        const songLink = songs[songId].link;
        const songEmbed = new EmbedBuilder()
            .setTitle("Music")
            .setDescription(`Playing ${songName}`);
        await interaction.reply({ embeds: [songEmbed] });
        client.distube.play(interaction.member.voice.channel, songLink, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        });
    },
};
