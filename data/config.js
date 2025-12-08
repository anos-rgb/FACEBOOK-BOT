module.exports = {
    // Headless mode (true = background, false = dengan browser)
    headless: false,

    // Interval pengecekan pesan (ms)
    checkInterval: 2000,

    // Viewport browser
    viewport: {
        width: 1280,
        height: 900
    },

    // User agent (Real Chrome user agent)
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Puppeteer arguments untuk anti-detection
    puppeteerArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--exclude-switches=enable-automation',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1280,900',
        '--start-maximized',
        '--disable-infobars',
        '--disable-notifications',
        '--no-first-run',
        '--no-default-browser-check'
    ],

    // Selector untuk cek login (prioritas dari atas ke bawah)
    loginSelectors: [
        '[aria-label="Chats"]',
        '[aria-label="Obrolan"]',
        '[aria-label="Messages"]',
        '[aria-label="Pesan"]',
        'a[href*="/messages/t/"]',
        '[data-pagelet="LeftRail"]',
        '[data-pagelet="MWJewelThreadList"]',
        'div[contenteditable="true"][role="textbox"]',
        '[role="navigation"]',
        'div[role="main"]'
    ],

    // Selector untuk input pesan (lebih comprehensive)
    inputSelectors: [
        'div[contenteditable="true"][role="textbox"]',
        '[aria-label="Message"]',
        '[aria-label="Pesan"]',
        'div[contenteditable="true"][aria-label*="essage" i]',
        'div[contenteditable="true"][aria-label*="esan" i]',
        'div[contenteditable="true"][data-lexical-editor="true"]',
        'div[contenteditable="true"]'
    ],

    // Prefix untuk command
    commandPrefix: '-',

    // Human behavior settings
    humanBehavior: {
        typingDelayMin: 30,      // Min delay antar karakter (ms)
        typingDelayMax: 120,     // Max delay antar karakter (ms)
        readingSpeed: 50,        // Milidetik per karakter saat "membaca"
        maxReadingTime: 3000,    // Max waktu "membaca" (ms)
        responseDelayMin: 800,   // Min delay sebelum merespon (ms)
        responseDelayMax: 2000   // Max delay sebelum merespon (ms)
    },

    // Bot info
    botInfo: {
        name: 'FB Messenger Bot',
        version: '2.0',
        author: 'Anti-Detection Edition'
    }
};