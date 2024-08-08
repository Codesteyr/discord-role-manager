const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription(
      "Установить сообщение для отслеживания реакций и выдачи ролей"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Установить сообщение")
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("ID сообщения")
            .setRequired(true)
        )
    ),
  run: async (client, interaction) => {
    const messageId = interaction.options.getString("message_id");

    // Проверка, что сообщение существует в текущем канале
    try {
      const message = await interaction.channel.messages.fetch(messageId);
      // Сохранение ID выбранного сообщения
      client.selectedMessage = messageId;

      await interaction.reply(
        `Сообщение для отслеживания реакций и выдачи ролей установлено на сообщение с ID: ${messageId}.`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Не удалось найти сообщение с ID: ${messageId}. Убедитесь, что ID сообщения верен и бот имеет доступ для его просмотра.`
      );
    }
  },
};
