const fs = require('fs');

const code = fs.readFileSync('server.js', 'utf8');
const match = code.match(/let mockBounties = (\[[\s\S]*?\]);/);
if (match) {
    const bounties = eval(match[1]);
    console.log("Current Bounties:", bounties);
}
