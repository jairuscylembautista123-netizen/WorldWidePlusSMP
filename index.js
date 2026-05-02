'use strict';

const bedrock = require('bedrock-protocol');
const config = require('./settings.json');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Health check so Render doesn't think the bot is dead
app.get('/', (req, res) => res.send('Bot is Alive!'));
app.listen(PORT, () => console.log(`[Server] Port ${PORT}`));

function createBot() {
  console.log(`[Bot] Attempting connection...`);
  try {
    const bot = bedrock.createClient({
      host: config.server.ip,
      port: parseInt(config.server.port),
      username: config['bot-account'].username,
      offline: true,
      version: "" // BLANK FOR AUTO-DETECT
    });

    bot.on('spawn', () => console.log('[+] Spawned!'));
    bot.on('error', (err) => {
      console.log(`[!] Error: ${err.message}`);
      setTimeout(createBot, 10000); // Reconnect loop
    });
    bot.on('close', () => {
      console.log('[-] Closed. Retrying...');
      setTimeout(createBot, 10000);
    });
  } catch (e) {
    console.log(`[CRASH] ${e.message}`);
    setTimeout(createBot, 10000);
  }
}

createBot();
