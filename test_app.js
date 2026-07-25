const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('public/index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

dom.window.fetch = () => Promise.resolve({ json: () => Promise.resolve([]) });

const scriptContent = fs.readFileSync('public/js/app.js', 'utf8');

// intercept console.error
dom.window.console.error = (msg, err) => {
    console.error("BROWSER_ERROR:", msg, err);
};

// run script
try {
    dom.window.eval(scriptContent);
    console.log("Script evaluated successfully without throwing.");
    
    // trigger DOMContentLoaded
    const event = dom.window.document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    dom.window.document.dispatchEvent(event);
    console.log("DOMContentLoaded dispatched.");
    
} catch(e) {
    console.error("Script failed:", e);
}
