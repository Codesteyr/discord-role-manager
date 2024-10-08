module.exports = (client) => {
  client.on("guildMemberAdd", (member) => {
    const welcomeMessage =
      `Здравствуйте, ${member.user.username}. Вы посетили Discord сервер Aion World.\n\n` +
      "**Мы приглашаем Вас присоединиться к ним и начать свое приключение.**\n\n" +
      "**Для этого выполните следующие простые шаги:**\n\n" +
      "• [Зарегистрируйтесь](https://worldaion.com/) в личном кабинете.\n" +
      '• Перейдите во вкладку "УСТАНОВИТЬ" и нажмите кнопку "Скачать", чтобы получить клиент игры.\n' +
      "• После установки клиента, войдите через лаунчер, используя данные, указанные при регистрации в личном кабинете.\n\n" +
      "**Благодарим за участие. Если у вас возникнут вопросы, не стесняйтесь обращаться за помощью к нам! **" +
      "[Наш Телеграм канал с новостями](https://t.me/aionworld)";

    member
      .send(welcomeMessage)
      .catch((error) =>
        console.error(
          `Ошибка при отправке сообщения в личные сообщения: ${error}`
        )
      );
  });
};
