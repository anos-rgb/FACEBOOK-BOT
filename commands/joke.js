module.exports = {
  name: 'joke',
  description: 'Jokes random',
  usage: '-joke',

  async execute(bot, args) {
    const jokes = [
      '😂 Kenapa programmer suka gelap? Karena light attracts bugs!',
      '🤣 HTML itu bahasa pemrograman? HayoloMasTanyaLagi',
      '😎 Kopi programmer: Java',
      '🤪 Bug adalah fitur yang belum didokumentasikan',
      '😅 Kenapa cicak jatuh? Karena dia coding tanpa testing!'
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await bot.sendMessage(joke);
  }
};