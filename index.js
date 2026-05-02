function createBot() {
  console.log(`[Bot] Connecting to ${config.server.ip}:${config.server.port}...`);[cite: 1]

  try {
    bot = bedrock.createClient({
      host: config.server.ip,
      port: config.server.port,
      username: config['bot-account'].username,
      offline: true, 
      version: "" // I SAID BLANK!
    });

    // ... (rest of your logic) ...
  } catch (err) {
    console.log(`[Bot] Failed: ${err.message}`);[cite: 1]
    scheduleReconnect();[cite: 1]
  }
}