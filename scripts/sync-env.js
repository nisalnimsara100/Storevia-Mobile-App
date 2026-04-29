const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envTextPath = path.join(__dirname, '../env.text');

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    // Ensure we don't accidentally commit an empty file if .env exists but is empty
    fs.writeFileSync(envTextPath, envContent);
    console.log('✅ Successfully synced .env to env.text');
} else {
    console.log('⚠️  .env file not found, skipping sync.');
}
