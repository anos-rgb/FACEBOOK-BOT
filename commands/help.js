module.exports = {
  name: 'help',
  description: 'Menampilkan daftar command',
  usage: '-help',

  async execute(bot, args) {
    const helpText = `🤖 Daftar Command Bot:

📋 Umum:
-help - Menu ini
-ping - Cek bot online
-info - Info tentang bot
-time - Waktu sekarang
-echo [teks] - Ulangi teks

💾 Simpan:
-save [link] - Simpan video/foto
-list - Lihat simpanan
-delete [nomor] - Hapus simpanan

🎮 Games:
-tebak [1-10] - Tebak angka
-suit [batu/gunting/kertas] - Suit
-slot - Slot machine
-score - Lihat skor

😄 Fun:
-joke - Jokes random
-meme - Meme lucu
-quotes - Quotes motivasi`;


    await bot.sendMessage(helpText);
  }
};