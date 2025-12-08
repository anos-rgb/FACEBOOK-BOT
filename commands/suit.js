const { loadData, saveData } = require('../utils/database');

module.exports = {
  name: 'suit',
  description: 'Game suit',
  usage: '-suit [batu/gunting/kertas]',

  async execute(bot, args) {
    const choices = ['batu', 'gunting', 'kertas'];
    const userChoice = args?.trim().toLowerCase();

    if (!choices.includes(userChoice)) {
      return await bot.sendMessage('❌ Pilih: batu, gunting, atau kertas\nContoh: -suit batu');
    }

    const botChoice = choices[Math.floor(Math.random() * 3)];
    const emoji = { batu: '✊', gunting: '✌️', kertas: '✋' };

    const scores = loadData('scores');
    const userId = 'default';

    if (!scores[userId]) {
      scores[userId] = { tebak: 0, suit: 0, slot: 0 };
    }

    let result = '';

    if (userChoice === botChoice) {
      result = '🤝 SERI!';
    } else if (
      (userChoice === 'batu' && botChoice === 'gunting') ||
      (userChoice === 'gunting' && botChoice === 'kertas') ||
      (userChoice === 'kertas' && botChoice === 'batu')
    ) {
      scores[userId].suit += 5;
      saveData('scores', scores);
      result = '🎉 MENANG! +5 poin!';
    } else {
      result = '😭 KALAH!';
    }

    await bot.sendMessage(`${emoji[userChoice]} vs ${emoji[botChoice]}\n${result}\nTotal: ${scores[userId].suit}`);
  }
};