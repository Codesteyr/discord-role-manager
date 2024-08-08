const client = require("../index");

client.on("ready", () => {
  console.log(`${client.user.username} работает`);
  // Ваш другой код, связанный с событием "ready"
});
