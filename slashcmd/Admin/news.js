const {
  EmbedBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuBuilder,
  TextInputStyle,
  ButtonStyle,
  ActionRowBuilder,
  Events,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`news`)
    .setDescription(`уведомить о новой новости`),

  run: async (client, interaction, message) => {
    // меню выбора
    const select = new StringSelectMenuBuilder()
      .setCustomId("select1")
      .setPlaceholder("Выбери нужный тебе цвет")
      .setMaxValues(1)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("зелёный")
          .setValue("color1"),

        new StringSelectMenuOptionBuilder()
          .setLabel("синий")
          .setValue("color2"),

        new StringSelectMenuOptionBuilder()
          .setLabel("жёлтый")
          .setValue("color3"),

        new StringSelectMenuOptionBuilder()
          .setLabel("белый")
          .setValue("color4"),

        new StringSelectMenuOptionBuilder()
          .setLabel("фиолетовый")
          .setValue("color5"),

        new StringSelectMenuOptionBuilder()
          .setLabel("морской")
          .setValue("color6"),

        new StringSelectMenuOptionBuilder()
          .setLabel("серый")
          .setValue("color7"),

        new StringSelectMenuOptionBuilder()
          .setLabel("оранжевый")
          .setValue("color8"),

        new StringSelectMenuOptionBuilder()
          .setLabel("красный")
          .setValue("color9")
      );
    const menu = new ActionRowBuilder().addComponents(select);

    // модальное окно с текстом
    const modal = new ModalBuilder()
      .setCustomId("modal")
      .setTitle("Новая новость!");
    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Введите заголовок новости")
      .setStyle(TextInputStyle.Short);
    const text = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("Введите текст новости")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(title);
    const secondActionRow = new ActionRowBuilder().addComponents(text);
    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

    client.on(Events.InteractionCreate, async (interaction) => {
      // сообщение о выборе цвета эмбеда
      embed1 = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Выберите цвет")
        .setDescription("выберите цвет вашей новости");

      if (!interaction.isModalSubmit()) return;
      if (interaction.customId === "modal") {
        await interaction.reply({
          embeds: [embed1],
          components: [menu],
          ephemeral: true,
        });
      }

      const collector = interaction.channel.createMessageComponentCollector();
      const titleinput = interaction.fields.getTextInputValue("title");
      const textinput = interaction.fields.getTextInputValue("text");

      console.log(`Заголовок: ${titleinput}`);
      console.log(`Текст: ${textinput}`);
      console.log(`Автор: ${interaction.user.username}`);

      const embed2 = new EmbedBuilder()
        .setTitle("Ваша новость")
        .setDescription(
          "Снизу показан пример вашей новости. Проверьте, вы точно хотите её опубликовать?"
        )
        .setColor("DarkGold");

      const embedyes = new EmbedBuilder()
        .setTitle("Новость отправлена!")
        .setColor("Green");

      const embedno = new EmbedBuilder()
        .setTitle("Новость отменена!")
        .setColor("Red");

      const button1 = new ButtonBuilder()
        .setCustomId("button1")
        .setLabel("Отправить новость")
        .setStyle(ButtonStyle.Success);
      const rowbutton1 = new ActionRowBuilder().addComponents(button1);

      const button2 = new ButtonBuilder()
        .setCustomId("button2")
        .setLabel("редактировать новость")
        .setStyle(ButtonStyle.Primary);
      const rowbutton2 = new ActionRowBuilder().addComponents(button2);

      const button3 = new ButtonBuilder()
        .setCustomId("button3")
        .setLabel("отменить новость")
        .setStyle(ButtonStyle.Danger);
      const rowbutton3 = new ActionRowBuilder().addComponents(button3);

      collector.on("collect", (interaction) => {
        if (interaction.customId == "button2") {
          interaction.showModal(modal);
        }
      });

      collector.on("collect", (interaction) => {
        if (interaction.customId == "button3") {
          interaction.reply({ embeds: [embedno], ephemeral: true });
        }
      });

      // зеленый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color1") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Green")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1213513528074440734";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1213513528074440734";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // синий
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color2") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Blue")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1213513528074440734";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // желтый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color3") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Yellow")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1135543106041815151";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // белый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color4") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("White")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // фиолетовый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color5") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Purple")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // морской
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color6") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Aqua")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // серый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color7") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Grey")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1143673080628138075";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      // Оранжевый
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color8") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Orange")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1213513528074440734";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });
      // Красный
      collector.on("collect", async (i) => {
        if (i.isStringSelectMenu()) {
          const selected = i.values[0];
          if (selected == "color9") {
            const user = interaction.user;
            const buildembed = new EmbedBuilder()
              .setTitle(titleinput)
              .setDescription(textinput)
              .setColor("Red")
              .setFooter({ text: `Автор: ${user.username}` });

            interaction.followUp({
              embeds: [embed2, buildembed],
              components: [rowbutton1, rowbutton2, rowbutton3],
              ephemeral: true,
            });

            collector.on("collect", (interaction) => {
              if (interaction.customId == "button1") {
                interaction.reply({ embeds: [embedyes], ephemeral: true });
                let chen = "1138908570474266714";
                client.channels.cache.get(chen).send({ embeds: [buildembed] });
                const embedlog = new EmbedBuilder()
                  .setTitle("Новость")
                  .setDescription(`${interaction.user} отправил новую новость.`)
                  .setColor("Blue");
                let chen1 = "1213513528074440734";
                client.channels.cache
                  .get(chen1)
                  .send({ embeds: [embedlog, buildembed] });
              }
            });
          }
        }
        return;
      });

      return;
    });
  },
};
