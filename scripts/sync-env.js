const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envTextPath = path.join(__dirname, '../env.text');
const envPath = path.join(__dirname, '../.env');

try {
    // 1. Scan code for EXPO_PUBLIC_ variables
    console.log('🔍 Scanning code for environment variables...');
    const grepCommand = "grep -r 'process.env.EXPO_PUBLIC_' app | sed 's/.*process.env.\\(EXPO_PUBLIC_[A-Z0-9_]*\\).*/\\1/' | sort | uniq";
    const output = execSync(grepCommand, { encoding: 'utf8' });
    const keys = output.split('\n').filter(key => key.trim().length > 0);

    // 2. Load existing values from .env if it exists
    let envValues = {};
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key) envValues[key.trim()] = valueParts.join('=').trim();
        });
    }

    // 3. Generate env.text content
    let content = '# Auto-generated Environment Template\n';
    content += '# Last updated: ' + new Date().toLocaleString() + '\n\n';
    
    keys.forEach(key => {
        const value = envValues[key] || ''; // Use value from .env or leave empty
        content += `${key}=${value}\n`;
    });

    fs.writeFileSync(envTextPath, content);
    console.log('✅ Successfully updated env.text with ' + keys.length + ' variables.');
} catch (err) {
    console.error('❌ Error during sync:', err.message);
}
