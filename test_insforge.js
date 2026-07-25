require('dotenv').config({ path: '.env.local' });

async function test() {
    try {
        const { createClient } = await import('@insforge/sdk');
        const insforge = createClient({
            baseUrl: process.env.INSFORGE_API_URL,
            anonKey: process.env.INSFORGE_ANON_KEY
        });
        
        console.log("Testing connection...");
        const { data, error } = await insforge.database.from('profiles').select('*').limit(1);
        if (error) {
            console.log("Warning (probably normal if table doesn't exist):", error.message || error);
        } else {
            console.log("Success:", data);
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}
test();
