require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama'
});

const app = express();
const PORT = process.env.PORT || 5500;

// Initialize Supabase Client dynamically (to support ESM exports in CJS)
let supabase;
let initError = null;

async function initSupabase() {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        
        if (supabaseUrl && supabaseAnonKey) {
            supabase = createClient(supabaseUrl, supabaseAnonKey);
            console.log("✅ Supabase SDK Client Initialized");
        } else {
            initError = "Supabase credentials not found in environment. URL: " + (supabaseUrl ? 'Found' : 'Missing') + ", Key: " + (supabaseAnonKey ? 'Found' : 'Missing');
            console.warn("⚠️ " + initError);
        }
    } catch (err) {
        initError = err.toString() + (err.stack ? "\n" + err.stack : "");
        console.error("Failed to initialize Supabase:", err);
    }
}
let initPromise = initSupabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure Supabase is initialized before handling any API requests
app.use('/api', async (req, res, next) => {
    await initPromise;
    next();
});

app.get('/api/supabase-status', async (req, res) => {
    if (!supabase) {
        return res.status(500).json({ error: "Supabase client not initialized", details: initError });
    }
    // Simple test query to check if the connection is alive
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
        // Even if the table doesn't exist, if it connects and returns a postgres error (e.g., 42P01 undefined_table), the connection is working.
        return res.json({ status: "Connected", message: "Client is configured, but table 'profiles' may not exist yet.", details: error });
    }
    
    res.json({ status: "Connected", data });
});

// --- AUTHENTICATION ROUTES (Phase 1) ---

const loginOtps = new Map(); // Store simulated OTPs: email -> { otp, accessToken, expiresAt }

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, name } = req.body;
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    
    const { data, error } = await supabase.auth.signUp({ email, password, name });
    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ message: "Sign up successful, please verify email.", data });
});

app.post('/api/auth/verify-signup', async (req, res) => {
    const { email, otp } = req.body;
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    
    const { data, error } = await supabase.auth.verifyEmail({ email, otp });
    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ message: "Verification successful", data });
});

app.post('/api/auth/login-step1', async (req, res) => {
    const { email, password } = req.body;
    if (!supabase) return res.status(500).json({ error: "Supabase not configured", details: initError });
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    
    // Generate 6-digit OTP for 2FA
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    loginOtps.set(email, { 
        otp, 
        accessToken: data.accessToken || null,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });
    
    console.log(`\n==========================================`);
    console.log(`🔒 Simulated 2FA Email to ${email}`);
    console.log(`   Your verification code is: ${otp}`);
    console.log(`==========================================\n`);
    
    res.json({ message: "2FA OTP sent to your email", requireOtp: true });
});

app.post('/api/auth/login-step2', async (req, res) => {
    const { email, otp } = req.body;
    const record = loginOtps.get(email);
    
    if (!record || record.expiresAt < Date.now()) {
        return res.status(400).json({ error: "OTP expired or not found. Try logging in again." });
    }
    if (record.otp !== otp) {
        return res.status(400).json({ error: "Invalid verification code." });
    }
    
    // Valid OTP! Clear it and return session
    loginOtps.delete(email);
    res.json({ message: "Login successful", accessToken: record.accessToken });
});

// --- AUTHENTICATION MIDDLEWARE ---
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = user;
        next();
    } catch(err) {
        console.error("Auth Error:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// --- API ENDPOINTS ---

app.get('/api/profile', requireAuth, async (req, res) => {
    const { data, error } = await supabase.database
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();
        
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
        return res.status(500).json({ error: error.message });
    }
    
    // Return empty profile if not found to handle first-time login
    res.json(data || { 
        name: req.user.user_metadata?.name || 'User',
        email: req.user.email,
        bounty_points: 0,
        badges: [],
        matches: []
    });
});

app.put('/api/profile', requireAuth, async (req, res) => {
    const profileData = req.body;
    
    // Upsert the profile data (insert if missing, update if exists)
    const { data, error } = await supabase.database
        .from('profiles')
        .upsert({ 
            id: req.user.id,
            email: req.user.email, // ensure email is set
            ...profileData 
        })
        .select()
        .single();
        
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, profile: data });
});

app.get('/api/roadmap', requireAuth, async (req, res) => {
    // Fetch roadmaps and associated courses
    const { data: roadmaps, error: roadmapError } = await supabase.database
        .from('roadmaps')
        .select('*, courses(*)')
        .eq('user_id', req.user.id)
        .order('year_name', { ascending: true });
        
    if (roadmapError) return res.status(500).json({ error: roadmapError.message });
    
    res.json(roadmaps || []);
});

app.get('/api/mentor/chat', requireAuth, async (req, res) => {
    const { data, error } = await supabase.database
        .from('chat_messages')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: true });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

app.post('/api/mentor/chat', requireAuth, async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: 'Message required' });

    // Ensure profile exists to avoid foreign key violations
    await supabase.from('profiles').upsert({ id: req.user.id }, { onConflict: 'id' });

    // Fetch last 5 messages for context BEFORE inserting the new one
    let history = [];
    try {
        const { data } = await supabase.database
            .from('chat_messages')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) history = data;
    } catch (e) {
        console.error("Error fetching history:", e);
    }

    // 1. Insert User Message
    const { error: err1 } = await supabase.from('chat_messages').insert({
        user_id: req.user.id,
        sender: 'user',
        text: userMessage
    });
    if (err1) console.error("Error inserting user message:", err1);

    try {
        let messages = [
            { role: 'system', content: 'You are Gemma AI, a helpful, encouraging, and highly knowledgeable AI mentor for LevelUp AI. You help software engineers prepare for interviews, learn new skills, and solve problems. Be concise but informative.' }
        ];

        // Add history (oldest first)
        const sortedHistory = history.reverse();
        for (const msg of sortedHistory) {
            messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            });
        }
        
        // Append current user message
        messages.push({ role: 'user', content: userMessage });

        const ollamaRes = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma4:e2b',
                messages: messages,
                stream: false
            })
        });
        
        if (!ollamaRes.ok) {
            throw new Error(`Ollama API error: ${ollamaRes.statusText}`);
        }
        
        const data = await ollamaRes.json();
        const aiResponseText = data.message?.content || "Sorry, I couldn't generate a response.";

        // 3. Insert AI Message
        const { data: aiMessageObj, error: insertError } = await supabase.database
            .from('chat_messages')
            .insert({
                user_id: req.user.id,
                sender: 'ai',
                text: aiResponseText
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting AI message:", insertError);
            // Don't fail the response, just return the AI text
            return res.json({ success: true, aiMessage: { sender: 'ai', text: aiResponseText } });
        }
        
        res.json({ success: true, aiMessage: aiMessageObj });
    } catch(err) {
        console.error("OpenAI/Ollama Error:", err);
        res.status(500).json({ error: "Failed to communicate with AI gateway." });
    }
});

app.post('/api/mentor/code_chat', requireAuth, async (req, res) => {
    const userMessage = req.body.message;
    const history = req.body.history || [];
    if (!userMessage) return res.status(400).json({ error: 'Message required' });

    try {
        let messages = [
            { role: 'system', content: 'You are a specialized code retrieval bot. You must ONLY output the raw code for the requested lecture or topic. Do not include greetings, explanations, or any markdown other than the code blocks. If you cannot provide code, reply with an empty code block.' }
        ];

        for (const msg of history) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }
        
        messages.push({ role: 'user', content: userMessage });

        const ollamaRes = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma4',
                messages: messages,
                stream: false
            })
        });
        
        if (!ollamaRes.ok) {
            throw new Error(`Ollama API error: ${ollamaRes.statusText}`);
        }
        
        const data = await ollamaRes.json();
        const aiResponseText = data.message?.content || "Sorry, I couldn't generate a response.";

        res.json({ success: true, aiMessage: { sender: 'ai', text: aiResponseText } });
    } catch(err) {
        console.error("OpenAI/Ollama Error:", err);
        res.status(500).json({ error: "Failed to communicate with AI gateway." });
    }
});
app.get('/api/bounties', requireAuth, async (req, res) => {
    // Fetch all global bounties
    const { data: bounties, error } = await supabase.database
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error) return res.status(500).json({ error: error.message });
    
    // Fetch user progress on bounties
    const { data: userBounties, error: ubError } = await supabase.database
        .from('user_bounties')
        .select('*')
        .eq('user_id', req.user.id);
        
    // Merge status
    if (bounties && userBounties) {
        bounties.forEach(bounty => {
            const userProgress = userBounties.find(ub => ub.bounty_id === bounty.id);
            if (userProgress && userProgress.status === 'Completed') {
                bounty.status = 'Completed';
            }
        });
    }
    
    res.json(bounties || []);
});

app.post('/api/bounties/:id/submit', requireAuth, async (req, res) => {
    const bountyId = req.params.id;
    const url = req.body.url;
    
    if (!url) return res.status(400).json({ error: 'Submission URL required' });

    const { data: bounty, error: bountyError } = await supabase.database
        .from('bounties')
        .select('*')
        .eq('bounty_id', bountyId)
        .single();
        
    if (bountyError || !bounty) {
        return res.status(404).json({ error: 'Bounty not found' });
    }
    
    try {
        let repoInfo = "No repository details available.";
        if (url.includes('github.com/')) {
            const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
            if (match && match[1]) {
                const repoName = match[1].replace('.git', '');
                try {
                    const ghRes = await fetch(`https://api.github.com/repos/${repoName}`);
                    if (ghRes.ok) {
                        const ghData = await ghRes.json();
                        repoInfo = `Repo Name: ${ghData.full_name}\nDescription: ${ghData.description}\nLanguage: ${ghData.language}`;
                    }
                } catch (e) {
                    console.error("Github fetch error:", e);
                }
            }
        }

        const prompt = `You are an expert AI code reviewer. A user has submitted a GitHub repository for a bounty.
Bounty Title: ${bounty.title}
Bounty Description: ${bounty.description}
Submitted URL: ${url}
Repository Info:
${repoInfo}

Does this repository look like a valid attempt at solving the bounty?
Respond with exactly one word: VALID or INVALID.`;

        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'gemma4:e2b',
                prompt: prompt,
                stream: false
            })
        });

        if (!ollamaRes.ok) throw new Error("Ollama API failed");
        
        const data = await ollamaRes.json();
        const aiResponse = (data.response || "").trim().toUpperCase();

        if (aiResponse.includes("VALID") && !aiResponse.includes("INVALID")) {
            await supabase.from('user_bounties').upsert({
                user_id: req.user.id,
                bounty_id: bounty.id,
                status: 'Completed',
                submitted_url: url
            });
            
            const pointsMatch = bounty.reward_amount.match(/\d+/);
            const rewardPoints = pointsMatch ? parseInt(pointsMatch[0], 10) : 0;
            
            const { data: profile } = await supabase.from('profiles').select('bounty_points').eq('id', req.user.id).single();
            const newPoints = (profile?.bounty_points || 0) + rewardPoints;
            
            await supabase.from('profiles').upsert({ id: req.user.id, bounty_points: newPoints });
                
            return res.json({ success: true, message: 'Bounty verified and completed!', bounty, newPoints });
        } else {
            return res.status(400).json({ error: 'AI Verification Failed: The submitted repository does not appear valid for this bounty.' });
        }
    } catch (err) {
        console.error("Bounty Verification Error:", err);
        return res.status(500).json({ error: 'Failed to communicate with AI for verification.' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
