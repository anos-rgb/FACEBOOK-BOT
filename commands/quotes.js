module.exports = {
    name: 'quotes',
    description: 'Quotes motivasi random',
    usage: '-quotes',

    async execute(bot, args) {
        const quotes = [
            '💪 "Sukses adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan."',
            '⭐ "Jangan menunggu kesempatan, tapi ciptakan kesempatan itu sendiri."',
            '🌟 "Mimpi tanpa action hanya tinggal angan-angan."',
            '🔥 "Kegagalan adalah kesuksesan yang tertunda."',
            '✨ "Mulai dari mana kamu berada, gunakan apa yang kamu punya, lakukan apa yang bisa kamu lakukan."',
            '🎯 "Jangan takut gagal, takutlah untuk tidak mencoba."',
            '💎 "Kesuksesan dimulai dari keputusan untuk mencoba."',
            '🚀 "Hari ini lebih baik dari kemarin, besok lebih baik dari hari ini."'
        ];

        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        await bot.sendMessage(quote);
    }
};
