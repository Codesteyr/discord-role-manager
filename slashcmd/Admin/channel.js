const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Выбрать текущий текстовый канал для дальнейших действий"),

  run: async (client, interaction) => {
    // Сохранение ID текущего текстового канала
    client.selectedChannel = interaction.channel.id;

    await interaction.reply(
      `Текущий текстовый канал установлен на <#${interaction.channel.id}>.`
    );
  },
};
