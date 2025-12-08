// Import semua command di sini
const help = require('./help');
const info = require('./info');
const ping = require('./ping');
const time = require('./time');
const echo = require('./echo');
const joke = require('./joke');
const meme = require('./meme');
const quotes = require('./quotes');
const tebak = require('./tebak');
const suit = require('./suit');
const slot = require('./slot');
const score = require('./score');
const save = require('./save');
const list = require('./list');
const deleteCmd = require('./delete');

// Export sebagai array
module.exports = [
    help,
    info,
    ping,
    time,
    echo,
    joke,
    meme,
    quotes,
    tebak,
    suit,
    slot,
    score,
    save,
    list,
    deleteCmd
];