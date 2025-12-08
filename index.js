const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class FacebookMessengerBot {
    constructor() {
        this.browser = null;
        this.page = null;
        this.sessionPath = path.join(__dirname, 'session');
        this.isRunning = false;
        this.lastProcessedText = '';
        this.messageHistory = new Set();
    }

    async init() {
        console.log('Memulai bot Facebook Messenger...');
        
        this.browser = await puppeteer.launch({
            headless: true,
            userDataDir: this.sessionPath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-web-security',
                '--window-size=1200,800'
            ]
        });

        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 800 });
        
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('Membuka Facebook...');
        await this.page.goto('https://www.facebook.com/messages', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        await this.page.waitForTimeout(3000);
        
        const isLoggedIn = await this.checkLogin();
        
        if (!isLoggedIn) {
            console.log('Silakan login secara manual...');
            console.log('Bot akan menunggu hingga kamu login...');
            await this.waitForLogin();
        }
        
        console.log('Login berhasil! Bot siap berjalan.');
        console.log('Bot aktif, menunggu pesan...\n');
        this.isRunning = true;
        await this.startListening();
    }

    async checkLogin() {
        try {
            const selectors = [
                '[aria-label="Obrolan"]',
                '[aria-label="Chats"]',
                'a[href="/messages/t/"]',
                '[data-pagelet="LeftRail"]'
            ];
            
            for (const selector of selectors) {
                try {
                    await this.page.waitForSelector(selector, { timeout: 2000 });
                    return true;
                } catch {}
            }
            return false;
        } catch {
            return false;
        }
    }

    async waitForLogin() {
        while (true) {
            await this.page.waitForTimeout(3000);
            const loggedIn = await this.checkLogin();
            if (loggedIn) break;
        }
    }

    async startListening() {
        while (this.isRunning) {
            try {
                await this.checkNewMessages();
                await this.page.waitForTimeout(1500);
            } catch (error) {
                // Silent error
            }
        }
    }

    async checkNewMessages() {
        try {
            // Ambil semua pesan di conversation yang aktif
            const messages = await this.page.evaluate(() => {
                const results = [];
                
                // Cari semua bubble pesan
                const msgContainers = document.querySelectorAll('[role="row"]');
                
                msgContainers.forEach((container) => {
                    // Cari teks di dalam bubble
                    const textDivs = container.querySelectorAll('div[dir="auto"]');
                    
                    textDivs.forEach((div) => {
                        const text = div.textContent.trim();
                        if (text && text.length > 0 && text.length < 500) {
                            // Cek apakah bubble ada di sebelah kiri (dari user lain)
                            const rect = container.getBoundingClientRect();
                            const isFromOther = rect.left < window.innerWidth / 2;
                            
                            results.push({
                                text: text,
                                isFromOther: isFromOther,
                                timestamp: Date.now()
                            });
                        }
                    });
                });
                
                return results;
            });

            // Filter pesan dari user lain saja
            const otherMessages = messages.filter(m => m.isFromOther);
            
            if (otherMessages.length > 0) {
                // Ambil pesan terakhir
                const lastMsg = otherMessages[otherMessages.length - 1];
                const msgKey = lastMsg.text + lastMsg.timestamp;
                
                // Cek apakah pesan baru
                if (!this.messageHistory.has(lastMsg.text) && 
                    lastMsg.text !== this.lastProcessedText) {
                    
                    console.log(`[${new Date().toLocaleTimeString()}] Pesan: ${lastMsg.text}`);
                    
                    this.lastProcessedText = lastMsg.text;
                    this.messageHistory.add(lastMsg.text);
                    
                    // Bersihkan history jika terlalu banyak
                    if (this.messageHistory.size > 50) {
                        this.messageHistory.clear();
                    }
                    
                    await this.page.waitForTimeout(500);
                    await this.processMessage(lastMsg.text);
                }
            }
            
        } catch (error) {
            // Silent
        }
    }

    async processMessage(message) {
        const cmd = message.toLowerCase().trim();
        
        if (cmd === '-help' || cmd === 'help') {
            await this.sendHelpMenu();
        } else if (cmd.startsWith('-')) {
            await this.handleCommand(cmd);
        }
    }

    async sendHelpMenu() {
        const helpText = 
`Menu Bantuan Bot FB
Perintah:
-help     → Menu ini
-info     → Info bot
-ping     → Test bot
-time     → Waktu sekarang
-echo [text] → Ulang teks
Contoh: -ping`;

        await this.sendMessage(helpText);
    }

    async handleCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1).join(' ');

        switch(cmd) {
            case '-info':
                await this.sendMessage('FB Messenger Bot v1.0\nPuppeteer + Node.js');
                break;
            
            case '-ping':
                await this.sendMessage('Pong! Bot aktif.');
                break;
            
            case '-time':
                const now = new Date();
                const timeStr = now.toLocaleString('id-ID', { 
                    timeZone: 'Asia/Jakarta'
                });
                await this.sendMessage(`Waktu: ${timeStr}`);
                break;
            
            case '-echo':
                if (args) {
                    await this.sendMessage(args);
                } else {
                    await this.sendMessage('Gunakan: -echo [teks]');
                }
                break;
            
            default:
                await this.sendMessage(`Command "${cmd}" tidak dikenali. Ketik -help`);
        }
    }

    async sendMessage(text) {
        try {
            await this.page.waitForTimeout(500);
            
            const inputSelectors = [
                '[aria-label="Pesan"]',
                '[aria-label="Message"]',
                'div[contenteditable="true"][role="textbox"]',
                'div[aria-label*="message" i]'
            ];
            
            for (const selector of inputSelectors) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        await this.page.click(selector);
                        await this.page.waitForTimeout(200);
                        
                        // Ketik pesan
                        await this.page.type(selector, text, { delay: 20 });
                        await this.page.waitForTimeout(300);
                        
                        // Kirim
                        await this.page.keyboard.press('Enter');
                        
                        console.log(`[${new Date().toLocaleTimeString()}] Terkirim: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}\n`);
                        
                        await this.page.waitForTimeout(800);
                        return;
                    }
                } catch {}
            }
            
            console.log('Gagal kirim pesan\n');
            
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async stop() {
        this.isRunning = false;
        if (this.browser) {
            await this.browser.close();
        }
        console.log('Bot dihentikan.');
    }
}

// Jalankan bot
const bot = new FacebookMessengerBot();

bot.init().catch(error => {
    console.error('Error menjalankan bot:', error);
    process.exit(1);
});

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\nMenghentikan bot...');
    await bot.stop();
    process.exit(0);
});