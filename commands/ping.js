module.exports = {
  name: 'ping',
  description: 'Cek bot online',
  usage: '-ping',

  async execute(bot, args) {
    await bot.sendMessage('🏓 Pong! Bot sedang online!');
  }
};