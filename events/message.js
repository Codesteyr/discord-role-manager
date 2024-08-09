module.exports = (client) => {
    const config = require("../config.js");
    const prefix = config.prefix;
  
    client.on("messageCreate", async (message) => {
      if (!message.guild) return;
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
  
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
  
      if (cmd.length === 0) return;
  
      let command = client.commands.get(cmd) || client.commands.get(client.commandaliases.get(cmd));
  
      if (command) {
        try {
          await command.execute(client, message, args);
        } catch (error) {
          console.error(error);
          try {
            const reply = await message.reply('Произошла ошибка при обработке твоей команды. Попробуй позднее.');
            setTimeout(() => reply.delete(), 5000);
          } catch (replyError) {
            console.error('Ошибка при попытке отправить ответ:', replyError);
          }
        }
      }
    });
  };
  