const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('public/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Simulate app.js
const bountiesContainer = document.getElementById('bounties-container');
if (!bountiesContainer) {
    console.log("No bounties-container found");
    process.exit(1);
}

const mockBounties = [{"bounty_id":"B-SEC-01","title":"Find SQL Injection Vulnerability","description":"Find and exploit the SQL Injection vulnerability present in our demo login system.","required_skills":["SQL","Security","Web Exploitation"],"reward_amount":"1000 XP","posted_by":"LevelUp Security Labs","gemma_match":98,"status":"Open"}];

function renderBounties(bounties) {
    bountiesContainer.innerHTML = '';
    bounties.forEach(bounty => {
        const card = document.createElement('div');
        card.className = 'bounty-card';
        
        let gemmaMatchHtml = '';
        if (bounty.gemma_match >= 90) {
            gemmaMatchHtml = `<div class="bounty-badge"><i class="ph-fill ph-sparkle"></i> ${bounty.gemma_match}% Match by Gemma AI</div>`;
        } else if (bounty.gemma_match) {
            gemmaMatchHtml = `<div class="bounty-badge" style="background: #F1F5F9; color: #475569;"><i class="ph ph-robot"></i> ${bounty.gemma_match}% Match</div>`;
        }

        const skillsHtml = bounty.required_skills.map(s => `<span class="bounty-skill">${s}</span>`).join('');
        
        const isCompleted = bounty.status === 'Completed';
        const actionHtml = isCompleted 
            ? `<span class="bounty-status"><i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Completed</span>`
            : `<button class="btn btn-primary" onclick="openBountyModal('${bounty.bounty_id}', '${bounty.title.replace(/'/g, "\\'")}')">Submit Code</button>`;

        card.innerHTML = `
            ${gemmaMatchHtml}
            <div class="bounty-title">${bounty.title}</div>
            <div class="bounty-posted">Posted by: ${bounty.posted_by}</div>
            <div class="bounty-desc">${bounty.description}</div>
            <div class="bounty-skills">${skillsHtml}</div>
            <div class="bounty-footer">
                <div class="bounty-reward"><i class="ph-fill ph-coin"></i> ${bounty.reward_amount}</div>
                ${actionHtml}
            </div>
        `;
        bountiesContainer.appendChild(card);
    });
}
renderBounties(mockBounties);
console.log("Rendered successfully. Inner HTML length:", bountiesContainer.innerHTML.length);
