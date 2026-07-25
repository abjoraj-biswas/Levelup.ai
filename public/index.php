<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LevelUp.AI - Career Dashboard</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
    <!-- Icons -->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css">
</head>

<body>
    <!-- Login Screen -->
    <div id="app-login" class="login-body">
        <div class="login-container">
            
            <!-- Left Side: Branding -->
            <div class="login-left">
                <div class="login-logo">
                    <span class="logo-dot"></span>levelup<span class="logo-ext">.ai</span>
                </div>
                
                <div class="login-graphic">
                    <div class="circle circle-6"></div>
                    <div class="circle circle-5"></div>
                    <div class="circle circle-4"></div>
                    <div class="circle circle-3"></div>
                    <div class="circle circle-2"></div>
                    <div class="circle circle-1">
                        <span class="circle-badge">01</span>
                        <span class="circle-text">YOUR<br>EDGE</span>
                    </div>
                </div>
                
                <div class="login-branding">
                    <p class="branding-eyebrow">CAREER INTELLIGENCE, REIMAGINED</p>
                    <h1 class="branding-title">Built around<br><span class="branding-highlight">your potential.</span></h1>
                    <p class="branding-desc">From first semester to first offer &mdash; a roadmap that<br>moves at your pace.</p>
                </div>
                
                <div class="login-footer-left">
                    <span>&copy; 2026 LEVELUP.AI</span>
                    <span>STUDENT OS / 01</span>
                </div>
            </div>
            
            <!-- Right Side: Form -->
            <div class="login-right">
                <div class="login-form-wrapper">
                    <p class="form-eyebrow">01 &mdash; WELCOME BACK</p>
                    <h2 class="form-title">Continue your<br>momentum.</h2>
                    <p class="form-subtitle">Sign in to return to your personalized career workspace.</p>
                    
                    <form class="login-form" id="loginForm">
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" id="email" value="aarya@levelup.ai" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="input-with-icon">
                                <input type="password" id="password" value="********" required>
                                <i class="ph-fill ph-eye input-icon"></i>
                            </div>
                        </div>
                        
                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Keep me signed in
                            </label>
                            <a href="#" class="forgot-link">Forgot password?</a>
                        </div>
                        
                        <button type="submit" class="btn btn-login">
                            Enter workspace <i class="ph-bold ph-arrow-up-right"></i>
                        </button>
                    </form>
                    
                    <p class="form-footer">
                        New to LevelUp? <a href="#">Create your profile</a>
                    </p>
                </div>
            </div>

        </div>
    </div>

    <!-- Main Dashboard -->
    <div id="app-dashboard" style="display: none;">
        <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo">
                    <span class="logo-dot"></span>levelup<span class="logo-ext">.ai</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-target="overview">
                    <i class="ph ph-house"></i>
                    <span>Overview</span>
                </a>
                <a href="#" class="nav-item" data-target="roadmap">
                    <i class="ph ph-map-trifold"></i>
                    <span>My Roadmap</span>
                </a>
                <a href="#" class="nav-item" data-target="upskill">
                    <i class="ph ph-sparkle"></i>
                    <span>Upskill Hub</span>
                </a>
                <a href="#" class="nav-item" data-target="mentor">
                    <i class="ph ph-robot"></i>
                    <span>AI Mentor</span>
                </a>
                <a href="#" class="nav-item" data-target="interview">
                    <i class="ph ph-target"></i>
                    <span>Interview Lab</span>
                </a>
                <a href="#" class="nav-item" data-target="profile">
                    <i class="ph ph-user"></i>
                    <span>Live Profile</span>
                </a>
                <a href="#" class="nav-item" data-target="bounties">
                    <i class="ph ph-briefcase"></i>
                    <span>Skill Bounties</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <div class="challenge-card">
                    <h4>Ready for a challenge?</h4>
                    <p>Your mock interview is waiting.</p>
                    <button class="btn btn-primary-alt">Start practice &rarr;</button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Topbar -->
            <header class="topbar">
                <div class="page-title">
                    <h2 id="current-page-title">Student dashboard</h2>
                </div>
                <div class="user-profile">
                    <div class="avatar">
                        <span>A</span>
                    </div>
                    <span class="username">Aarya</span>
                    <i class="ph ph-caret-down"></i>
                </div>
            </header>

            <!-- Dynamic Views Container -->
            <div id="views-container" class="views-container">
                <!-- Overview View -->
                <div class="view active" id="view-overview">
                    <div class="dashboard-grid">
                        <!-- Left Column -->
                        <div class="dash-col-left">
                            <div class="banner-card">
                                <span class="eyebrow">YOUR CAREER, IN MOTION</span>
                                <h1>Your next level starts today.</h1>
                                <p>You're building real momentum. Finish this week's goals to unlock your next roadmap
                                    milestone.</p>
                                <button class="btn btn-banner">Continue roadmap &rarr;</button>
                            </div>

                            <div class="roadmap-preview-card">
                                <div class="card-header">
                                    <div>
                                        <h3>Your 4-year roadmap</h3>
                                        <p>Year 2 &middot; AI / ML track &middot; 46% complete</p>
                                    </div>
                                    <a href="#" class="view-link"
                                        onclick="document.querySelector('[data-target=\'roadmap\']').click()">View full
                                        roadmap &rarr;</a>
                                </div>
                                <div class="roadmap-timeline">
                                    <div class="timeline-card completed">
                                        <h4>Year 1</h4>
                                        <p>Explore & build foundations</p>
                                        <span class="status"><i class="ph ph-check"></i> Completed</span>
                                    </div>
                                    <div class="timeline-card active">
                                        <div class="badge">NOW</div>
                                        <h4>Year 2</h4>
                                        <p>Ship projects & specialize</p>
                                        <span class="status highlight">4 goals active</span>
                                    </div>
                                    <div class="timeline-card locked">
                                        <h4>Year 3</h4>
                                        <p>Internships & industry depth</p>
                                    </div>
                                    <div class="timeline-card locked">
                                        <h4>Year 4</h4>
                                        <p>Launch your career</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="dash-col-right">
                            <div class="streak-card">
                                <div class="streak-header">
                                    <h3>Growth streak <i class="ph ph-fire"></i></h3>
                                </div>
                                <div class="streak-days">12 <span>days</span></div>
                                <p class="streak-meta">You're in the top 18% of learners.</p>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: 75%"></div>
                                </div>
                            </div>

                            <div class="mentor-card">
                                <i class="ph-fill ph-sparkle top-right-icon"></i>
                                <span class="eyebrow">LEVELUP AI MENTOR</span>
                                <h3>What will you build this week?</h3>
                                <p>Ask for a project brief, clear a coding doubt, or prepare for a hackathon.</p>
                                <div class="mentor-actions">
                                    <button class="btn-pill">Suggest a project</button>
                                    <button class="btn-pill">Explain a concept</button>
                                    <button class="btn-pill">Hackathon idea</button>
                                </div>
                            </div>

                            <div class="stats-row">
                                <div class="stat-card">
                                    <span class="stat-title">Recruiter match</span>
                                    <div class="stat-value">86%</div>
                                    <p class="stat-change positive">&uarr; 8% this month</p>
                                    <div class="progress-bar-container small">
                                        <div class="progress-bar purple" style="width: 86%"></div>
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-title">Live skill profile</span>
                                    <div class="radar-chart-placeholder">
                                        <!-- SVG approximation of a radar chart -->
                                        <svg viewBox="0 0 100 100" class="radar-svg">
                                            <polygon points="50,5 95,35 80,90 20,90 5,35" fill="none" stroke="#e2e8f0"
                                                stroke-width="1" />
                                            <polygon points="50,25 80,45 70,80 30,80 20,45"
                                                fill="rgba(107, 76, 230, 0.2)" stroke="#6B4CE6" stroke-width="2" />
                                            <line x1="50" y1="50" x2="50" y2="5" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="95" y2="35" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="80" y2="90" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="20" y2="90" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="5" y2="35" stroke="#e2e8f0" stroke-width="1" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Other Views -->
                <div class="view" id="view-roadmap">
                    <div class="roadmap-view">
                        <div class="view-header">
                            <h2>Your 4-Year Curriculum</h2>
                            <p>AI / ML Engineering Track</p>
                        </div>

                        <div class="roadmap-path">
                            <div class="roadmap-stage completed">
                                <div class="stage-marker"><i class="ph ph-check"></i></div>
                                <div class="stage-content">
                                    <span class="eyebrow">YEAR 1 &middot; COMPLETED</span>
                                    <h3>Foundations & Logic</h3>
                                    <div class="stage-details">
                                        <div class="course-pill">Data Structures</div>
                                        <div class="course-pill">Python Basics</div>
                                        <div class="course-pill">Linear Algebra</div>
                                    </div>
                                </div>
                            </div>

                            <div class="roadmap-stage active">
                                <div class="stage-marker current"></div>
                                <div class="stage-content">
                                    <span class="eyebrow">YEAR 2 &middot; IN PROGRESS</span>
                                    <h3>Core Machine Learning</h3>
                                    <div class="stage-details grid">
                                        <div class="course-card active">
                                            <h4>Supervised Learning</h4>
                                            <div class="progress-bar-container">
                                                <div class="progress-bar purple" style="width: 60%"></div>
                                            </div>
                                        </div>
                                        <div class="course-card">
                                            <h4>Neural Networks</h4>
                                            <span class="status-badge">Next Module</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="roadmap-stage locked">
                                <div class="stage-marker"><i class="ph ph-lock-key"></i></div>
                                <div class="stage-content">
                                    <span class="eyebrow">YEAR 3 &middot; LOCKED</span>
                                    <h3>Advanced AI & NLP</h3>
                                    <p class="lock-msg">Complete Year 2 goals to unlock this stage.</p>
                                </div>
                            </div>

                            <div class="roadmap-stage locked">
                                <div class="stage-marker"><i class="ph ph-lock-key"></i></div>
                                <div class="stage-content">
                                    <span class="eyebrow">YEAR 4 &middot; LOCKED</span>
                                    <h3>Industry Readiness</h3>
                                    <p class="lock-msg">Complete Year 3 goals to unlock this stage.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="view" id="view-upskill">
                    <div class="upskill-view">
                        <div class="view-header">
                            <h2>Upskill Hub</h2>
                            <p>Earn verified certificates to automatically update your Live Profile.</p>
                        </div>

                        <div class="upskill-grid">
                            <div class="course-item">
                                <div class="course-img" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53);">
                                    <i class="ph-fill ph-code"></i>
                                </div>
                                <div class="course-info">
                                    <h3>Advanced React Patterns</h3>
                                    <p>Complete 4 projects to earn badge.</p>
                                    <button class="btn btn-primary-alt">Start Course</button>
                                </div>
                            </div>
                            <div class="course-item">
                                <div class="course-img" style="background: linear-gradient(135deg, #4A3AFF, #8A64FF);">
                                    <i class="ph-fill ph-brain"></i>
                                </div>
                                <div class="course-info">
                                    <h3>TensorFlow Foundations</h3>
                                    <p>Complete 2 projects to earn badge.</p>
                                    <button class="btn btn-primary-alt">Resume</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="view" id="view-mentor">
                    <div class="mentor-view">
                        <div class="mentor-chat">
                            <div class="chat-header">
                                <div><i class="ph-fill ph-sparkle"></i> Gemma AI Edge Mentor</div>
                                <span class="offline-badge"><i class="ph ph-wifi-slash"></i> Offline Ready</span>
                            </div>
                            <div class="chat-messages">
                                <div class="message ai">
                                    <div class="msg-avatar"><i class="ph-fill ph-robot"></i></div>
                                    <div class="msg-bubble">Hello! I noticed you are working on your Year 2 Neural
                                        Networks module. Need help understanding Backpropagation?</div>
                                </div>
                                <div class="message user">
                                    <div class="msg-avatar">A</div>
                                    <div class="msg-bubble">Yes, can you generate a simple Python architecture for it?
                                    </div>
                                </div>
                                <div class="message ai">
                                    <div class="msg-avatar"><i class="ph-fill ph-robot"></i></div>
                                    <div class="msg-bubble">
                                        <p>Sure! I've drafted a basic Neural Network structure using Numpy. Check the
                                            workspace on the right.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="chat-input-area">
                                <input type="text" placeholder="Ask Gemma for help, project ideas, or code reviews...">
                                <button class="btn btn-send"><i class="ph ph-paper-plane-right"></i></button>
                            </div>
                        </div>
                        <div class="mentor-workspace">
                            <div class="workspace-header">Project Architecture Preview</div>
                            <div class="workspace-content">
                                <pre><code>import numpy as np

class NeuralNetwork:
    def __init__(self, layers):
        self.layers = layers
        # Initialize weights and biases
        
    def forward(self, X):
        pass
        
    def backward(self, X, y, output):
        # Backpropagation logic
        pass</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="view" id="view-interview">
                    <div class="interview-view">
                        <div class="view-header">
                            <h2>Interview Lab & Stream Assessment</h2>
                            <p>Prepare for behavioral rounds and discover your ideal engineering track.</p>
                        </div>

                        <div class="interview-grid">
                            <div class="assessment-card">
                                <div class="card-icon" style="background: #e0e7ff; color: #4338ca;">
                                    <i class="ph-fill ph-game-controller"></i>
                                </div>
                                <h3>Gamified Stream Assessment</h3>
                                <p>For 1st year students: Discover your cognitive traits and logical reasoning to find
                                    the perfect engineering stream.</p>
                                <button class="btn btn-primary-alt" style="margin-top: 16px;">Start Assessment</button>
                            </div>

                            <div class="assessment-card">
                                <div class="card-icon" style="background: #fee2e2; color: #b91c1c;">
                                    <i class="ph-fill ph-users"></i>
                                </div>
                                <h3>ATS & HR Screening Simulator</h3>
                                <p>Gemma-powered situational tests to score your analytical thinking, communication, and
                                    pressure handling.</p>
                                <button class="btn btn-primary-alt" style="margin-top: 16px;">Start Mock
                                    Interview</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="view" id="view-profile">
                    <div class="profile-view">
                        <div class="view-header">
                            <h2>Live Profile (Anti-Resume)</h2>
                            <p>Your verified 100% fake-proof data for corporate matching.</p>
                        </div>

                        <div class="profile-layout">
                            <div class="profile-main">
                                <div class="profile-card">
                                    <h3>Technical & Psychometric Radar</h3>
                                    <div class="radar-container">
                                        <svg viewBox="0 0 100 100" class="radar-svg-large">
                                            <polygon points="50,10 90,40 75,85 25,85 10,40" fill="none" stroke="#e2e8f0"
                                                stroke-width="1" />
                                            <polygon points="50,20 80,45 70,80 30,80 20,45" fill="none" stroke="#e2e8f0"
                                                stroke-width="1" stroke-dasharray="2,2" />
                                            <polygon points="50,25 80,50 60,85 40,70 15,40"
                                                fill="rgba(107, 76, 230, 0.2)" stroke="#6B4CE6" stroke-width="2" />
                                            <line x1="50" y1="50" x2="50" y2="10" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="90" y2="40" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="75" y2="85" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="25" y2="85" stroke="#e2e8f0" stroke-width="1" />
                                            <line x1="50" y1="50" x2="10" y2="40" stroke="#e2e8f0" stroke-width="1" />
                                            <text x="50" y="8" font-size="3" text-anchor="middle" fill="#64748b"
                                                font-weight="600">Coding</text>
                                            <text x="92" y="40" font-size="3" text-anchor="start" fill="#64748b"
                                                font-weight="600">Communication</text>
                                            <text x="76" y="88" font-size="3" text-anchor="start" fill="#64748b"
                                                font-weight="600">Pressure</text>
                                            <text x="24" y="88" font-size="3" text-anchor="end" fill="#64748b"
                                                font-weight="600">Analytical</text>
                                            <text x="8" y="40" font-size="3" text-anchor="end" fill="#64748b"
                                                font-weight="600">Sys Design</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="profile-sidebar">
                                <div class="tracker-card">
                                    <h3><i class="ph-fill ph-heartbeat" style="color: #ef4444;"></i> Medical & Physical
                                        Tracker</h3>
                                    <p class="tracker-desc">Verified criteria for Defense, Aviation, Merchant Navy, and
                                        Core Engineering.</p>

                                    <div class="tracker-item">
                                        <span class="label">Vision</span>
                                        <span class="value valid">6/6 (Uncorrected) <i
                                                class="ph-fill ph-check-circle"></i></span>
                                    </div>
                                    <div class="tracker-item">
                                        <span class="label">Height</span>
                                        <span class="value">175 cm</span>
                                    </div>
                                    <div class="tracker-item">
                                        <span class="label">Fitness</span>
                                        <span class="value valid">Class 1 Medical <i
                                                class="ph-fill ph-check-circle"></i></span>
                                    </div>
                                </div>

                                <div class="tracker-card">
                                    <h3>Corporate Matches</h3>
                                    <div class="match-item">
                                        <div class="match-logo" style="background:#4285f4; color:white;">G</div>
                                        <div class="match-info">
                                            <h4>Google</h4>
                                            <span>SWE Role - 92% Match</span>
                                        </div>
                                    </div>
                                    <div class="match-item">
                                        <div class="match-logo" style="background:#000; color:white;">U</div>
                                        <div class="match-info">
                                            <h4>Uber</h4>
                                            <span>Backend - 88% Match</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Skill Bounties View -->
                <div class="view" id="view-bounties">
                    <div class="bounties-header">
                        <div class="bounties-title-section">
                            <h3>Skill Bounties</h3>
                            <p>Complete real-world micro-tasks from recruiters and peers to earn XP and verified badges.</p>
                        </div>
                    </div>
                    
                    <div class="bounties-grid" id="bounties-container">
                        <!-- Bounty cards injected here via JS -->
                    </div>
                </div>

            </div>
        </main>

        <!-- Bounty Submission Modal -->
        <div id="bounty-modal" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>Submit Bounty</h4>
                    <button id="close-modal" class="btn-icon"><i class="ph ph-x"></i></button>
                </div>
                <div class="modal-body">
                    <p class="modal-subtitle" id="modal-bounty-title"></p>
                    <p style="margin-bottom: 12px; font-size: 14px;">Enter the link to your completed code (e.g. GitHub PR, Repo):</p>
                    <input type="url" id="bounty-url" class="bounty-input" placeholder="https://github.com/..." required>
                    <div id="bounty-ai-status" class="ai-status" style="display: none;">
                        <i class="ph-bold ph-spinner ph-spin"></i> <span>Gemma AI is verifying your code...</span>
                    </div>
                    <div id="bounty-success-status" class="ai-success" style="display: none;">
                        <i class="ph-fill ph-check-circle"></i> Verification Complete! Badge Awarded.
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="btn-submit-bounty" class="btn btn-primary" style="width: 100%;">Submit for Verification</button>
                </div>
            </div>
        </div>
    </div>
    </div>

    <script src="js/app.js"></script>
</body>

</html>