const express = require('express');
const { Client } = require('aternos-api');
const app = express();

// Keep Render from being a "looser" and shutting down
app.get('/', (req, res) => res.send('Xiality Sigma Engine: ONLINE 🧤'));
app.listen(3000, () => console.log('Web server is locked in! 🛡️🔥'));

const aternos = new Client();

async function keepServerAlive() {
    try {
        // LOCK IN YOUR ACTUAL TRUTH CREDENTIALS
        await aternos.login('YOUR_USERNAME', 'YOUR_PASSWORD');
        const servers = await aternos.getServers();
        const myServer = servers[0]; // Your main Sigma server

        setInterval(async () => {
            await myServer.fetch();
            if (myServer.status === 'offline') {
                console.log("STATUS: STINKY_OFFLINE... RESTARTING... 💀");
                await myServer.start();
            } else {
                console.log("STATUS: SIGMA_ONLINE... VIBE_CHECK: 1,000,000/10 🧤");
            }
        }, 300000); // Check every 5 minutes
    } catch (err) {
        console.log("ENGINE_CHOPPED: Reconnecting in 1 minute... 📟");
        setTimeout(keepServerAlive, 60000);
    }
}

keepServerAlive();
