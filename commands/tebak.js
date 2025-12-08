const { loadData, saveData } = require('../utils/database');

module.exports = {
  name: 'tebak',
  description: 'Game tebak angka',
  usage: '-tebak [1-10]',

  async execute(bot, args) {
    if (!args || args.trim().length === 0) {
      return await bot.sendMessage('🎲 Tebak angka 1-10!\nContoh: -tebak 5');
    }

    const guess = parseInt(args.trim());

    if (isNaN(guess) || guess < 1 || guess > 10) {
      return await bot.sendMessage('❌ Masukkan angka 1-10!');
    }

    const answer = Math.floor(Math.random() * 10) + 1;
    const scores = loadData('scores');

    // Use a generic user ID since we can't track individual users in Puppeteer easily
    const userId = 'default';

    if (!scores[userId]) {
      scores[userId] = { tebak: 0, suit: 0, slot: 0 };
    }

    if (guess === answer) {
      scores[userId].tebak += 10;
      saveData('scores', scores);
      await bot.sendMessage(`🎉 BENAR! Angkanya ${answer}\n+10 poin!\nTotal: ${scores[userId].tebak}`);
    } else {
      await bot.sendMessage(`❌ Salah! Angkanya ${answer}\nCoba lagi!`);
    }
  }
};