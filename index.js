'use strict';

const bedrock = require('bedrock-protocol'); //
const config = require('./settings.json'); //
const express = require('express'); //
const http = require('http'); //
const https = require('https'); //

// ============================================================
// EXPRESS SERVER - Keep Render/Aternos alive
// ============================================================
const app = express(); //
const PORT = process.env.PORT || 5000; //[cite: 1]

let botState = {
  connected: false,
  startTime: Date.now(),
  reconnectAttempts: 0
}; //[cite: 1]

app.get('/', (req, res) => {
  res.send(`<h1>🤖 ${config.name} Bedrock Edition</h1><p>Status: ${botState.connected ? 'Online' : 'Connecting...'}</p>`); //[cite: 1]
});

app.get('/health', (req, res) => {
  res.json({
    status: botState.connected ? 'connected' : 'disconnected',
    uptime: Math.floor((Date.now() - botState.startTime) / 1000)
  }); //[cite: 1]
});

app.get('/ping', (req, res) => res.send('pong')); //[cite: 1]

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] HTTP server started on port ${server.address().port}`); //[cite: 1]
});

// ============================================================
// BOT CREATION - BEDROCK PROTOCOL (aka BED)
// ============================================================
let bot = null; //[cite: 1]
let isReconnecting = false; //[cite: 1]

function createBot() {
  if (isReconnecting) return; //[cite: 1]
  
  console.log(`[Bot] Connecting to ${config.server.ip}:${config.server.port}...`); //[cite: 1]

  try {
    bot = bedrock.createClient({
      host: config.WorldWidePlusSMP, //[cite: 1]
      port: parseInt(config.23270), //[cite: 1]
      username: config['bot-account'].username, //[cite: 1]
      offline: true, //[cite: 1]
      version: "" // I SAID BLANK![cite: 1]
    });

    bot.on('spawn', () => {
      console.log(`[+] Successfully spawned on Bedrock!`); //[cite: 1]
      botState.connected = true; //[cite: 1]
      botState.reconnectAttempts = 0; //[cite: 1]
      isReconnecting = false; //[cite: 1]

      // ANTI-AFK: Move head to stop "stinky" Aternos kicks
      setInterval(() => {
        if (botState.connected) {
          bot.queue('player_auth_input', {
            pitch: 0,
            yaw: Math.random() * 360,
            position: { x: 0, y: 0, z: 0 },
            move_vector: { x: 0, z: 0 },
            input_data: { _value: 0 }
          }); //[cite: 1]
        }
      }, 30000); //[cite: 1]
    });

    bot.on('error', (err) => {
      console.log(`[Bot] Error: ${err.message}`); //[cite: 1]
      botState.connected = false; //[cite: 1]
      scheduleReconnect(); //[cite: 1]
    });

    bot.on('close', () => {
      console.log(`[-] Disconnected.`); //[cite: 1]
      botState.connected = false; //[cite: 1]
      scheduleReconnect(); //[cite: 1]
    });

  } catch (err) {
    console.log(`[Bot] Failed to create: ${err.message}`); //[cite: 1]
    scheduleReconnect(); //[cite: 1]
  }
}

function scheduleReconnect() {
  if (isReconnecting) return; //[cite: 1]
  isReconnecting = true; //[cite: 1]
  botState.reconnectAttempts++; //[cite: 1]
  console.log(`[Bot] Reconnecting in 10s...`); //[cite: 1]
  setTimeout(() => {
    isReconnecting = false; //[cite: 1]
    createBot(); //[cite: 1]
  }, 10000); //[cite: 1]
}

createBot(); //[cite: 1]
