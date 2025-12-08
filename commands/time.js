module.exports = {
    name: 'time',
    description: 'Menampilkan waktu sekarang',
    usage: '-time',

    async execute(bot, args) {
        const now = new Date();

        // Indonesia time (WIB)
        const optionsTime = {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const optionsDate = {
            timeZone: 'Asia/Jakarta',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const time = now.toLocaleTimeString('id-ID', optionsTime);
        const date = now.toLocaleDateString('id-ID', optionsDate);

        const response = `🕐 Waktu Sekarang\n\n` +
            `📅 ${date}\n` +
            `⏰ ${time} WIB`;

        await bot.sendMessage(response);
    }
};
