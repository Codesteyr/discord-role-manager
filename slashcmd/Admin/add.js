const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Добавить реакцию и роль к сообщению")
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("Эмодзи для реакции")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription("Роль для выдачи").setRequired(true)
    ),
  run: async (client, interaction) => {
    const emoji = interaction.options.getString("emoji");
    const role = interaction.options.getRole("role");

    // Проверка, что сообщение и роль установлены
    if (!client.selectedMessage || !role) {
      await interaction.reply(
        "Установите сначала сообщение и роль, используя команды /message set и /role set."
      );
      return;
    }

    // Добавление реакции к выбранному сообщению
    try {
      const message = await interaction.channel.messages.fetch(
        client.selectedMessage
      );
      await message.react(emoji);

      // Сохранение информации о реакции и роли
      if (!client.reactionRoles) {
        client.reactionRoles = [];
      }

      client.reactionRoles.push({
        messageId: client.selectedMessage,
        emoji: emoji,
        roleId: role.id,
      });

      await interaction.reply(
        `Реакция ${emoji} добавлена. При реакции на сообщение будет выдана роль ${role.name}.`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Не удалось добавить реакцию. Убедитесь, что сообщение установлено и бот имеет доступ для его редактирования и добавления реакций."
      );
    }
  },
};
