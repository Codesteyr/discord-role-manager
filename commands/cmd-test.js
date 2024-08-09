const {
  EmbedBuilder,
  Events,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../index");

module.exports = {
  name: "ping",
  aliases: ["ping"],
  execute: async (client, message, interaction) => { 
    message.channel.send("pong");
  },
};
