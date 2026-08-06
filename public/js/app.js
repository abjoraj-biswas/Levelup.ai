document.addEventListener('DOMContentLoaded', () => {
    // --- Login Logic ---
    const loginForm = document.getElementById('loginForm');
    const appLogin = document.getElementById('app-login');
    const appDashboard = document.getElementById('app-dashboard');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appLogin.style.display = 'none';
            appDashboard.style.display = 'block';
        });
    }

    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('current-page-title');

    const viewTitles = {
        'overview': 'Student dashboard',
        'roadmap': 'My 4-Year Roadmap',
        'upskill': 'Upskill Hub',
        'mentor': 'AI Mentor (Gemma)',
        'interview': 'Interview Lab',
        'profile': 'Live Profile (Anti-Resume)',
        'bounties': 'Skill Bounties',
        'matches': 'Corporate Matches',
        'myprofile': 'Manage My Profile'
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(`view-${targetId}`).classList.add('active');
            pageTitle.textContent = viewTitles[targetId] || 'Student dashboard';

            if (targetId === 'profile') {
                const skillBars = document.querySelectorAll('.skill-bar-fill');
                skillBars.forEach(bar => {
                    setTimeout(() => {
                        bar.style.width = bar.getAttribute('data-target-width');
                    }, 50);
                });
            }
        });
    });

    // --- User Dropdown & Dark Mode ---
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const logoutBtn = document.getElementById('nav-logout');

    if (userProfileBtn && userDropdownMenu) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!userDropdownMenu.contains(e.target) && !userProfileBtn.contains(e.target)) {
                userDropdownMenu.classList.remove('show');
            }
        });

        // --- Notification Dropdown ---
        const notificationBtn = document.getElementById('notification-btn');
        const notificationDropdown = document.getElementById('notification-dropdown');
        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (notificationDropdown.style.display === 'none') {
                    notificationDropdown.style.display = 'block';
                } else {
                    notificationDropdown.style.display = 'none';
                }
            });

            document.addEventListener('click', (e) => {
                if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                    notificationDropdown.style.display = 'none';
                }
            });
        }

        // Dropdown Navigation
        const dropdownItems = userDropdownMenu.querySelectorAll('.dropdown-item[data-target]');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');

                // Hide dropdown
                userDropdownMenu.classList.remove('show');

                // Switch view
                navItems.forEach(nav => nav.classList.remove('active'));
                views.forEach(view => view.classList.remove('active'));

                const targetView = document.getElementById(`view-${targetId}`);
                if (targetView) {
                    targetView.classList.add('active');
                    pageTitle.textContent = viewTitles[targetId] || 'Dashboard';
                }
            });
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            const icon = themeToggleBtn.querySelector('i');
            const text = themeToggleBtn.querySelector('span');

            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('ph-moon');
                icon.classList.add('ph-sun');
                text.textContent = 'Light Mode';
            } else {
                icon.classList.remove('ph-sun');
                icon.classList.add('ph-moon');
                text.textContent = 'Dark Mode';
            }
            userDropdownMenu.classList.remove('show');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appDashboard.style.display = 'none';
            appLogin.style.display = 'flex'; // show login
            userDropdownMenu.classList.remove('show');
        });
    }

    // --- My Profile Form ---
    const btnSaveProfile = document.getElementById('btn-save-profile');
    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', async () => {
            const newName = document.getElementById('manage-name').value;

            try {
                // Update backend
                await fetchWithAuth('/api/profile', {
                    method: 'PUT',
                    body: JSON.stringify({ name: newName })
                });

                // Update UI elements
                const navUsername = document.getElementById('nav-username');
                const navAvatarImg = document.getElementById('nav-avatar-img');
                const manageAvatarImg = document.getElementById('manage-avatar-preview');

                if (navUsername) navUsername.textContent = newName;

                // Simple avatar generation based on name
                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random&color=fff`;
                if (navAvatarImg) navAvatarImg.src = avatarUrl;
                if (manageAvatarImg) manageAvatarImg.src = avatarUrl;

                alert('Profile saved successfully!');
            } catch (err) {
                console.error("Failed to save profile:", err);
                alert("Failed to save profile");
            }
        });
    }

    // --- Backend API Integration ---
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('insforge_token');
        if (!token) {
            window.location.href = 'auth.html';
            throw new Error('No token found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        };

        const baseUrl = window.location.port === '5501' || window.location.protocol === 'file:' ? 'http://localhost:5500' : '';
        const response = await fetch(baseUrl + url, { ...options, headers });
        if (response.status === 401) {
            localStorage.removeItem('insforge_token');
            window.location.href = 'auth.html';
            throw new Error('Unauthorized');
        }
        return response;
    }
    function updateBountyPointsUI(points) {
        const pointsEl = document.getElementById('live-bounty-points');
        const progressFill = document.getElementById('cert-progress-fill');
        const certUnlock = document.getElementById('certificate-unlock');

        if (pointsEl) pointsEl.textContent = points;

        if (progressFill) {
            const percentage = Math.min(100, (points / 5000) * 100);
            progressFill.style.width = percentage + '%';

            if (percentage >= 100 && certUnlock) {
                certUnlock.style.display = 'flex';
            }
        }
    }

    // 1. Fetch Profile Data
    fetchWithAuth('/api/profile')
        .then(res => res.json())
        .then(data => {
            console.log("Loaded Profile from Backend:", data);
            if (data.bountyPoints !== undefined) {
                updateBountyPointsUI(data.bountyPoints);
            }
        })
        .catch(err => console.error("Error loading profile:", err));

    // 2. Fetch Roadmap Data (Proof of Concept)
    fetchWithAuth('/api/roadmap')
        .then(res => res.json())
        .then(data => console.log("Loaded Roadmap from Backend:", data))
        .catch(err => console.error("Error loading roadmap:", err));

    // 3. Mentor Chat Integration
    const chatMessagesContainer = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input-area input');
    const chatSendBtn = document.querySelector('.chat-input-area .btn-send');

    function renderMessage(msg) {
        const div = document.createElement('div');
        div.className = `message ${msg.sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = msg.sender === 'ai' ? '<i class="ph-fill ph-robot"></i>' : 'A';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = msg.text;

        div.appendChild(avatar);
        div.appendChild(bubble);
        chatMessagesContainer.appendChild(div);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function loadChatHistory() {
        fetchWithAuth('/api/mentor/chat')
            .then(res => res.json())
            .then(messages => {
                chatMessagesContainer.innerHTML = ''; // clear static
                messages.forEach(renderMessage);
            });
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';
        renderMessage({ sender: 'user', text: text });

        fetchWithAuth('/api/mentor/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        })
            .then(res => res.json())
            .then(data => {
                if (data.aiMessage) {
                    renderMessage(data.aiMessage);
                }
            })
            .catch(err => console.error("Chat error:", err));
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Load initial chat
    loadChatHistory();

    // --- 4. Code Chat Integration ---
    const codeChatMessagesContainer = document.querySelector('.code-chat-messages');
    const codeChatInput = document.querySelector('.code-chat-input');
    const codeChatSendBtn = document.querySelector('.btn-code-send');
    let codeChatHistory = [];

    function renderCodeMessage(msg) {
        const div = document.createElement('div');
        div.className = `message ${msg.sender}`;
        div.style.display = 'flex';
        div.style.gap = '12px';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.style.width = '32px';
        avatar.style.height = '32px';
        avatar.style.borderRadius = '50%';
        avatar.style.background = msg.sender === 'ai' ? 'var(--primary)' : '#475569';
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';
        avatar.style.flexShrink = '0';
        avatar.innerHTML = msg.sender === 'ai' ? '<i class="ph-fill ph-robot"></i>' : 'U';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.style.background = 'rgba(255,255,255,0.05)';
        bubble.style.padding = '12px 16px';
        bubble.style.borderRadius = '12px';
        bubble.style.borderTopLeftRadius = msg.sender === 'ai' ? '0' : '12px';
        bubble.style.borderTopRightRadius = msg.sender === 'user' ? '0' : '12px';
        bubble.style.fontSize = '14px';
        bubble.style.color = 'var(--text-secondary)';
        bubble.style.maxWidth = '100%';
        bubble.style.overflowX = 'auto';

        if (msg.sender === 'ai') {
            // Strip markdown code fences if present, then wrap in pre tag
            let rawCode = msg.text.replace(/```[a-z]*\n/gi, '').replace(/```/g, '').trim();
            bubble.innerHTML = `<pre style="margin: 0;"><code>${rawCode}</code></pre>`;
        } else {
            bubble.textContent = msg.text;
        }

        div.appendChild(avatar);
        div.appendChild(bubble);
        codeChatMessagesContainer.appendChild(div);
        codeChatMessagesContainer.scrollTop = codeChatMessagesContainer.scrollHeight;
    }

    function sendCodeMessage() {
        if (!codeChatInput) return;
        const text = codeChatInput.value.trim();
        if (!text) return;

        codeChatInput.value = '';
        renderCodeMessage({ sender: 'user', text: text });

        // Show a loading indicator (optional, simple text for now)
        const loadingId = 'loading-' + Date.now();
        const loadingMsg = document.createElement('div');
        loadingMsg.id = loadingId;
        loadingMsg.style.fontSize = '12px';
        loadingMsg.style.color = '#64748b';
        loadingMsg.style.marginTop = '8px';
        loadingMsg.textContent = 'Generating code...';
        codeChatMessagesContainer.appendChild(loadingMsg);
        codeChatMessagesContainer.scrollTop = codeChatMessagesContainer.scrollHeight;

        fetchWithAuth('/api/mentor/code_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: codeChatHistory })
        })
            .then(res => res.json())
            .then(data => {
                document.getElementById(loadingId)?.remove();
                if (data.aiMessage) {
                    renderCodeMessage(data.aiMessage);
                    codeChatHistory.push({ role: 'user', content: text });
                    codeChatHistory.push({ role: 'assistant', content: data.aiMessage.text });
                }
            })
            .catch(err => {
                document.getElementById(loadingId)?.remove();
                console.error("Code Chat error:", err);
            });
    }

    if (codeChatSendBtn && codeChatInput) {
        codeChatSendBtn.addEventListener('click', sendCodeMessage);
        codeChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendCodeMessage();
        });
    }

    // --- Skill Bounties Integration ---
    const bountiesContainer = document.getElementById('bounties-container');
    const bountyModal = document.getElementById('bounty-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const btnSubmitBounty = document.getElementById('btn-submit-bounty');
    const modalBountyTitle = document.getElementById('modal-bounty-title');
    const aiStatus = document.getElementById('bounty-ai-status');
    const aiSuccess = document.getElementById('bounty-success-status');
    const bountyUrlInput = document.getElementById('bounty-url');
    let currentBountyId = null;

    function renderBounties(bounties) {
        if (!bountiesContainer) return;
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

    const fallbackBounties = [
        {
            bounty_id: "B-SEC-01", title: "Find SQL Injection Vulnerability", description: "Find and exploit the SQL Injection vulnerability present in our demo login system.",
            required_skills: ["SQL", "Security", "Web Exploitation"], reward_amount: "1000 XP", posted_by: "LevelUp Security Labs", gemma_match: 98, status: "Open"
        },
        {
            bounty_id: "B-SEC-02", title: "Find XSS Vulnerabilities", description: "Identify stored or reflected XSS vulnerabilities in our e-commerce website.",
            required_skills: ["XSS", "JavaScript", "Security Testing"], reward_amount: "800 XP", posted_by: "Tech Recruiter", gemma_match: 95, status: "Open"
        },
        {
            bounty_id: "B-SEC-03", title: "Authentication Bypass Challenge", description: "Bypass the authentication mechanism and gain access to the admin panel.",
            required_skills: ["JWT", "Authentication", "Security"], reward_amount: "1500 XP", posted_by: "Security Team", gemma_match: 96, status: "Open"
        },
        {
            bounty_id: "B-SEC-04", title: "Hidden Admin Panel Hunt", description: "Find the hidden admin dashboard and demonstrate how it can be accessed.",
            required_skills: ["OSINT", "Web Security"], reward_amount: "500 XP", posted_by: "LevelUp Labs", gemma_match: 90, status: "Open"
        },
        {
            bounty_id: "B-SEC-05", title: "Broken Access Control", description: "Escalate your privileges from a normal user to an admin account.",
            required_skills: ["Access Control", "Security"], reward_amount: "1200 XP", posted_by: "Startup Inc.", gemma_match: 97, status: "Open"
        },
        {
            bounty_id: "B-SEC-06", title: "API Bug Hunting", description: "Find vulnerabilities in the REST APIs provided.",
            required_skills: ["REST API", "Postman", "Security"], reward_amount: "900 XP", posted_by: "Software Company", gemma_match: 93, status: "Open"
        },
        {
            bounty_id: "B-SEC-07", title: "Find Sensitive Data Exposure", description: "Discover exposed API keys or sensitive information in the application.",
            required_skills: ["Security", "Information Disclosure"], reward_amount: "700 XP", posted_by: "LevelUp AI", gemma_match: 91, status: "Open"
        },
        {
            bounty_id: "B-SEC-08", title: "Rate Limit Bypass", description: "Bypass the API rate limiting mechanism.",
            required_skills: ["API Security", "Backend"], reward_amount: "1000 XP", posted_by: "Community Challenge", gemma_match: 89, status: "Open"
        },
        {
            bounty_id: "B-SEC-09", title: "Session Hijacking Challenge", description: "Exploit insecure session management in the application.",
            required_skills: ["Cookies", "Authentication"], reward_amount: "1200 XP", posted_by: "Security Labs", gemma_match: 94, status: "Open"
        },
        {
            bounty_id: "B-SEC-10", title: "CSRF Attack Challenge", description: "Demonstrate how the application is vulnerable to CSRF attacks.",
            required_skills: ["CSRF", "Web Security"], reward_amount: "800 XP", posted_by: "LevelUp Security Team", gemma_match: 92, status: "Open"
        }
    ];

    function loadBounties() {
        fetchWithAuth('/api/bounties')
            .then(res => {
                if (!res.ok) throw new Error('Backend not available');
                return res.json();
            })
            .then(data => {
                renderBounties(data);
            })
            .catch(err => {
                console.warn("Falling back to local bounties data:", err);
                renderBounties(fallbackBounties);
            });
    }

    window.openBountyModal = function (id, title) {
        currentBountyId = id;
        modalBountyTitle.textContent = title;
        bountyUrlInput.value = '';
        aiStatus.style.display = 'none';
        aiSuccess.style.display = 'none';
        btnSubmitBounty.style.display = 'block';
        bountyModal.style.display = 'flex';
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            bountyModal.style.display = 'none';
        });
    }

    if (btnSubmitBounty) {
        btnSubmitBounty.addEventListener('click', () => {
            if (!bountyUrlInput.value) {
                alert("Please enter a URL to your code.");
                return;
            }

            btnSubmitBounty.style.display = 'none';
            aiStatus.style.display = 'flex';

            fetchWithAuth(`/api/bounties/${currentBountyId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: bountyUrlInput.value })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Backend not available');
                    return res.json();
                })
                .then(data => {
                    if (data.success) {
                        handleSuccess(data.newPoints);
                    } else {
                        throw new Error('Submission failed');
                    }
                })
                .catch(err => {
                    console.warn("Falling back to local submission simulation:", err);
                    setTimeout(() => {
                        const bounty = fallbackBounties.find(b => b.bounty_id === currentBountyId) || { reward_amount: "1000 XP" };
                        let currentPoints = parseInt(document.getElementById('live-bounty-points').textContent) || 400;
                        const pointsMatch = bounty.reward_amount.match(/\d+/);
                        if (pointsMatch) {
                            currentPoints += parseInt(pointsMatch[0], 10);
                        }
                        handleSuccess(currentPoints);
                    }, 1500);
                });

            function handleSuccess(newPoints) {
                aiStatus.style.display = 'none';
                aiSuccess.style.display = 'flex';

                updateBountyPointsUI(newPoints);

                const cardBtn = document.querySelector(`button[onclick*="${currentBountyId}"]`);
                if (cardBtn) {
                    const footer = cardBtn.parentElement;
                    cardBtn.remove();
                    footer.insertAdjacentHTML('beforeend', '<span class="bounty-status"><i class="ph-fill ph-check-circle" style="color:#10B981;"></i> Completed</span>');
                }

                setTimeout(() => {
                    bountyModal.style.display = 'none';
                }, 2000);
            }
        });
    }

    // Load bounties initially
    loadBounties();
});

// --- Path Skills Modal Logic ---
const pathSkillsData = {
    'Programming Language': [
        { skill: 'C', payment: 500, lectures: 12 },
        { skill: 'C++', payment: 500, lectures: 13 },
        { skill: 'Java', payment: 500, lectures: 14 },
        { skill: 'Python', payment: 500, lectures: 15 },
        { skill: 'JavaScript', payment: 500, lectures: 16 },
        { skill: 'Go', payment: 500, lectures: 17 },
        { skill: 'Rust', payment: 500, lectures: 18 },
        { skill: 'SQL', payment: 500, lectures: 19 }
    ],
    'Data Structure & Algorithm': [
        { skill: 'Arrays', payment: 500, lectures: 12 },
        { skill: 'Linked List', payment: 500, lectures: 13 },
        { skill: 'Stack', payment: 500, lectures: 14 },
        { skill: 'Queue', payment: 500, lectures: 15 },
        { skill: 'Trees', payment: 500, lectures: 16 },
        { skill: 'Graphs', payment: 500, lectures: 17 },
        { skill: 'DP', payment: 500, lectures: 18 }
    ],
    'Frontend Development': [
        { skill: 'HTML', payment: 500, lectures: 12 },
        { skill: 'CSS', payment: 500, lectures: 13 },
        { skill: 'JavaScript', payment: 500, lectures: 14 },
        { skill: 'React', payment: 500, lectures: 15 },
        { skill: 'Next.js', payment: 500, lectures: 16 },
        { skill: 'Tailwind', payment: 500, lectures: 17 },
        { skill: 'Bootstrap', payment: 500, lectures: 18 },
        { skill: 'TypeScript', payment: 500, lectures: 19 },
        { skill: 'Accessibility', payment: 500, lectures: 20 }
    ],
    'Backend Development': [
        { skill: 'Node.js', payment: 500, lectures: 12 },
        { skill: 'Express', payment: 500, lectures: 13 },
        { skill: 'Python Django', payment: 500, lectures: 14 },
        { skill: 'Flask', payment: 500, lectures: 15 },
        { skill: 'Java Spring', payment: 500, lectures: 16 },
        { skill: 'REST API', payment: 500, lectures: 17 },
        { skill: 'Authentication', payment: 500, lectures: 18 },
        { skill: 'Databases', payment: 500, lectures: 19 },
        { skill: 'ORM', payment: 500, lectures: 20 },
        { skill: 'Caching', payment: 500, lectures: 10 },
        { skill: 'Testing', payment: 500, lectures: 11 }
    ],
    'Full Stack Development': [
        { skill: 'MERN', payment: 500, lectures: 12 },
        { skill: 'MEAN', payment: 500, lectures: 13 },
        { skill: 'Next Full Stack', payment: 500, lectures: 14 },
        { skill: 'API Integration', payment: 500, lectures: 15 },
        { skill: 'Deployment', payment: 500, lectures: 16 },
        { skill: 'Projects', payment: 500, lectures: 17 }
    ],
    'AI': [
        { skill: 'AI Basics', payment: 500, lectures: 12 },
        { skill: 'Prompt Engineering', payment: 500, lectures: 13 },
        { skill: 'LLMs', payment: 500, lectures: 14 },
        { skill: 'NLP', payment: 500, lectures: 15 },
        { skill: 'Computer Vision', payment: 500, lectures: 16 }
    ],
    'Machine Learning': [
        { skill: 'Python ML', payment: 500, lectures: 12 },
        { skill: 'NumPy', payment: 500, lectures: 13 },
        { skill: 'Pandas', payment: 500, lectures: 14 },
        { skill: 'Scikit-learn', payment: 500, lectures: 15 },
        { skill: 'Regression', payment: 500, lectures: 16 },
        { skill: 'Classification', payment: 500, lectures: 17 },
        { skill: 'Clustering', payment: 500, lectures: 18 },
        { skill: 'Model Evaluation', payment: 500, lectures: 19 }
    ],
    'Cyber Security': [
        { skill: 'Networking', payment: 500, lectures: 12 },
        { skill: 'Linux', payment: 500, lectures: 13 },
        { skill: 'OWASP', payment: 500, lectures: 14 },
        { skill: 'Web Security', payment: 500, lectures: 15 },
        { skill: 'Cryptography', payment: 500, lectures: 16 },
        { skill: 'Ethical Hacking', payment: 500, lectures: 17 },
        { skill: 'Burp Suite', payment: 500, lectures: 18 },
        { skill: 'Wireshark', payment: 500, lectures: 19 },
        { skill: 'Malware Analysis', payment: 500, lectures: 20 },
        { skill: 'Cloud Security', payment: 500, lectures: 10 },
        { skill: 'IAM', payment: 500, lectures: 11 },
        { skill: 'Incident Response', payment: 500, lectures: 12 }
    ],
    'Cloud Computing': [
        { skill: 'Cloud Basics', payment: 500, lectures: 12 },
        { skill: 'AWS', payment: 500, lectures: 13 },
        { skill: 'Azure', payment: 500, lectures: 14 },
        { skill: 'GCP', payment: 500, lectures: 15 },
        { skill: 'Docker', payment: 500, lectures: 16 },
        { skill: 'Kubernetes', payment: 500, lectures: 17 }
    ],
    'DevOps': [
        { skill: 'Linux', payment: 500, lectures: 12 },
        { skill: 'Git', payment: 500, lectures: 13 },
        { skill: 'CI/CD', payment: 500, lectures: 14 },
        { skill: 'Docker', payment: 500, lectures: 15 },
        { skill: 'Kubernetes', payment: 500, lectures: 16 },
        { skill: 'Terraform', payment: 500, lectures: 17 },
        { skill: 'Monitoring', payment: 500, lectures: 18 },
        { skill: 'Jenkins', payment: 500, lectures: 19 }
    ]
};

window.openPathModal = function (category) {
    const modal = document.getElementById('path-modal');
    const title = document.getElementById('modal-path-title');
    const skillsContainer = document.getElementById('modal-path-skills');

    if (!modal || !title || !skillsContainer) return;

    title.textContent = category + ' Path';
    skillsContainer.innerHTML = '';

    const skills = pathSkillsData[category] || [];
    if (skills.length === 0) {
        skillsContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-secondary);">Skills coming soon!</p>';
    } else {
        let html = '<div class="skills-card-grid">';

        skills.forEach(item => {
            html += `
                <div class="skill-card-box">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h5 style="font-size: 15px; color: #1e293b; margin-bottom: 4px; font-weight: 600;">${item.skill}</h5>
                            <span style="font-size: 13px; color: #64748b;">${item.lectures} Lectures</span>
                        </div>
                        <div style="background: #f1f5f9; padding: 4px 10px; border-radius: 12px; font-weight: 600; color: #0f172a; font-size: 13px; display: flex; align-items: center; gap: 4px;">
                            <i class="ph-fill ph-coin" style="color: #f59e0b;"></i> ${item.payment}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        skillsContainer.innerHTML = html;
    }

    modal.style.display = 'flex';
};

window.closePathModal = function () {
    const modal = document.getElementById('path-modal');
    if (modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    // Assessment Modal Logic
    const btnOpenAssessments = document.getElementById('btn-open-assessments');
    const assessmentModal = document.getElementById('assessment-modal');
    const btnCloseAssessmentModal = document.getElementById('close-assessment-modal');

    if (btnOpenAssessments && assessmentModal) {
        btnOpenAssessments.addEventListener('click', () => {
            assessmentModal.style.display = 'flex';
        });
    }

    if (btnCloseAssessmentModal && assessmentModal) {
        btnCloseAssessmentModal.addEventListener('click', () => {
            assessmentModal.style.display = 'none';
        });
    }

    // Close on click outside
    if (assessmentModal) {
        window.addEventListener('click', (e) => {
            if (e.target === assessmentModal) {
                assessmentModal.style.display = 'none';
            }
        });
    }

    // Mock Interview Modal Logic
    const btnOpenMockInterviews = document.getElementById('btn-open-mock-interviews');
    const mockInterviewModal = document.getElementById('mock-interview-modal');
    const btnCloseMockInterviewModal = document.getElementById('close-mock-interview-modal');

    if (btnOpenMockInterviews && mockInterviewModal) {
        btnOpenMockInterviews.addEventListener('click', () => {
            mockInterviewModal.style.display = 'flex';
        });
    }

    if (btnCloseMockInterviewModal && mockInterviewModal) {
        btnCloseMockInterviewModal.addEventListener('click', () => {
            mockInterviewModal.style.display = 'none';
        });
    }

    // Close on click outside
    if (mockInterviewModal) {
        window.addEventListener('click', (e) => {
            if (e.target === mockInterviewModal) {
                mockInterviewModal.style.display = 'none';
            }
        });
    }

    // --- Profile Photo Upload Logic ---
    const btnUploadPhoto = document.getElementById('btn-upload-photo');
    const photoInput = document.getElementById('manage-photo-input');
    const avatarPreview = document.getElementById('manage-avatar-preview');

    if (btnUploadPhoto && photoInput) {
        btnUploadPhoto.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    if (avatarPreview) {
                        avatarPreview.src = event.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Load Saved Profile ---
    const savedName = localStorage.getItem('profileName');
    const navUsername = document.getElementById('nav-username');
    const navAvatarImg = document.getElementById('nav-avatar-img');
    const manageNameInput = document.getElementById('manage-name');

    if (savedName) {
        if (navUsername) navUsername.textContent = savedName;
        if (manageNameInput) manageNameInput.value = savedName;
        if (navAvatarImg) {
            navAvatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(savedName)}&background=random&color=fff`;
        }
    }

    // --- Save All Changes Logic ---
    const btnSaveAllProfile = document.getElementById('btn-save-all-profile');
    if (btnSaveAllProfile && manageNameInput) {
        btnSaveAllProfile.addEventListener('click', () => {
            const newName = manageNameInput.value.trim();
            if (newName) {
                // Save to localStorage
                localStorage.setItem('profileName', newName);

                // Update UI
                if (navUsername) navUsername.textContent = newName;
                if (navAvatarImg) {
                    navAvatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random&color=fff`;
                }

                // Show basic success alert
                alert('Profile updated successfully!');
            } else {
                alert('Please enter a valid name.');
            }
        });
    }
});
