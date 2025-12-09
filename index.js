const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const CommandHandler = require('./commands/CommandHandler');

class FacebookMessengerBot {
    constructor() {
        this.browser = null;
        this.activeTabs = new Map();
        this.sessionPath = path.join(__dirname, 'session');
        this.isRunning = false;
        this.MAX_TABS = 10;
        this.commandHandler = null;
    }

    async init() {
        console.log('Memulai bot Facebook Messenger...');
        
        this.browser = await puppeteer.launch({
            headless: false,
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

        this.commandHandler = new CommandHandler(this);

        const mainPage = await this.browser.newPage();
        await mainPage.setViewport({ width: 1200, height: 800 });
        await mainPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('Membuka Facebook...');
        await mainPage.goto('https://www.facebook.com/messages', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        await mainPage.waitForTimeout(3000);
        
        const isLoggedIn = await this.checkLogin(mainPage);
        
        if (!isLoggedIn) {
            console.log('Silakan login secara manual...');
            await this.waitForLogin(mainPage);
        }
        
        console.log('Login berhasil! Bot siap berjalan.');
        console.log('Bot aktif, menunggu pesan dari semua orang...\n');
        
        this.isRunning = true;
        await this.startListening(mainPage);
    }

    async checkLogin(page) {
        try {
            const selectors = [
                '[aria-label="Obrolan"]',
                '[aria-label="Chats"]',
                'a[href="/messages/t/"]',
                '[data-pagelet="LeftRail"]'
            ];
            
            for (const selector of selectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 2000 });
                    return true;
                } catch {}
            }
            return false;
        } catch {
            return false;
        }
    }

    async waitForLogin(page) {
        while (true) {
            await page.waitForTimeout(3000);
            const loggedIn = await this.checkLogin(page);
            if (loggedIn) break;
        }
    }

    async startListening(mainPage) {
        while (this.isRunning) {
            try {
                await this.manageConversations(mainPage);
                await mainPage.waitForTimeout(2000);
            } catch (error) {
                console.error('Error listening:', error.message);
            }
        }
    }

    async manageConversations(mainPage) {
        try {
            const conversations = await mainPage.evaluate(() => {
                const convList = [];
                const convElements = document.querySelectorAll('a[href*="/messages/t/"]');
                
                convElements.forEach((elem, idx) => {
                    if (idx < 15) {
                        const href = elem.getAttribute('href');
                        const match = href.match(/\/messages\/t\/(\d+)/);
                        if (match) {
                            convList.push({
                                threadId: match[1],
                                url: 'https://www.facebook.com' + href
                            });
                        }
                    }
                });
                
                return convList;
            });

            for (const conv of conversations) {
                if (!this.activeTabs.has(conv.threadId)) {
                    if (this.activeTabs.size >= this.MAX_TABS) {
                        await this.cleanupInactiveTabs();
                    }
                    
                    await this.openConversationTab(conv);
                }
                
                const tabData = this.activeTabs.get(conv.threadId);
                if (tabData) {
                    tabData.lastActivity = Date.now();
                    await this.checkMessagesInTab(tabData);
                }
            }
            
            await this.cleanupInactiveTabs();
            
        } catch (error) {
            console.error('Error managing conversations:', error.message);
        }
    }

    async openConversationTab(conv) {
        try {
            const newPage = await this.browser.newPage();
            await newPage.setViewport({ width: 1200, height: 800 });
            await newPage.goto(conv.url, { waitUntil: 'networkidle2', timeout: 30000 });
            await newPage.waitForTimeout(2000);
            
            this.activeTabs.set(conv.threadId, {
                page: newPage,
                threadId: conv.threadId,
                lastActivity: Date.now(),
                lastProcessedText: '',
                messageHistory: new Set()
            });
            
            console.log(`Tab baru dibuka untuk thread: ${conv.threadId}`);
        } catch (error) {
            console.error(`Gagal membuka tab untuk thread ${conv.threadId}`);
        }
    }

    async cleanupInactiveTabs() {
        const now = Date.now();
        const INACTIVE_TIMEOUT = 5 * 60 * 1000;
        
        for (const [threadId, tabData] of this.activeTabs.entries()) {
            if (now - tabData.lastActivity > INACTIVE_TIMEOUT) {
                await tabData.page.close();
                this.activeTabs.delete(threadId);
                console.log(`Tab ditutup untuk thread: ${threadId} (tidak aktif)`);
            }
        }
    }

    async checkMessagesInTab(tabData) {
        try {
            const messages = await tabData.page.evaluate(() => {
                const results = [];
                const msgContainers = document.querySelectorAll('[role="row"]');
                
                msgContainers.forEach((container) => {
                    const textDivs = container.querySelectorAll('div[dir="auto"]');
                    
                    textDivs.forEach((div) => {
                        const text = div.textContent.trim();
                        if (text && text.length > 0 && text.length < 500) {
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

            const otherMessages = messages.filter(m => m.isFromOther);
            
            if (otherMessages.length > 0) {
                const lastMsg = otherMessages[otherMessages.length - 1];
                
                if (!tabData.messageHistory.has(lastMsg.text) && 
                    lastMsg.text !== tabData.lastProcessedText) {
                    
                    console.log(`[${new Date().toLocaleTimeString()}] Thread ${tabData.threadId}: ${lastMsg.text}`);
                    
                    tabData.lastProcessedText = lastMsg.text;
                    tabData.messageHistory.add(lastMsg.text);
                    
                    if (tabData.messageHistory.size > 50) {
                        tabData.messageHistory.clear();
                    }
                    
                    tabData.currentPage = tabData.page;
                    await this.commandHandler.execute(lastMsg.text);
                }
            }
            
        } catch (error) {
            console.error(`Error checking messages in thread ${tabData.threadId}`);
        }
    }

    async sendMessage(text) {
        try {
            let targetPage = null;
            
            for (const [threadId, tabData] of this.activeTabs.entries()) {
                if (tabData.currentPage) {
                    targetPage = tabData.currentPage;
                    delete tabData.currentPage;
                    break;
                }
            }
            
            if (!targetPage) {
                console.log('Tidak ada target page untuk mengirim pesan');
                return;
            }

            const inputSelectors = [
                '[aria-label="Pesan"]',
                '[aria-label="Message"]',
                'div[contenteditable="true"][role="textbox"]',
                'div[aria-label*="message" i]'
            ];
            
            for (const selector of inputSelectors) {
                try {
                    const element = await targetPage.$(selector);
                    if (element) {
                        await targetPage.click(selector);
                        await targetPage.waitForTimeout(300);
                        
                        await targetPage.evaluate((sel, txt) => {
                            const el = document.querySelector(sel);
                            if (el) {
                                el.textContent = txt;
                                el.dispatchEvent(new InputEvent('input', { bubbles: true }));
                            }
                        }, selector, text);
                        
                        await targetPage.waitForTimeout(500);
                        await targetPage.keyboard.press('Enter');
                        
                        console.log(`[${new Date().toLocaleTimeString()}] Terkirim: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n`);
                        
                        await targetPage.waitForTimeout(1000);
                        return;
                    }
                } catch {}
            }
            
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    }

    async stop() {
        this.isRunning = false;
        
        for (const [threadId, tabData] of this.activeTabs.entries()) {
            await tabData.page.close();
        }
        
        if (this.browser) {
            await this.browser.close();
        }
        console.log('Bot dihentikan.');
    }
}

const bot = new FacebookMessengerBot();

bot.init().catch(error => {
    console.error('Error menjalankan bot:', error);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('\nMenghentikan bot...');
    await bot.stop();
    process.exit(0);
});
