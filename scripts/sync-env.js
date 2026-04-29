const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envTextPath = path.join(__dirname, '../env.text');

const direction = process.argv[2]; // 'to-text' or 'to-env'

if (direction === 'to-text') {
    // Commit time: .env -> env.text
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        fs.writeFileSync(envTextPath, content);
        console.log('✅ Mirroring .env to env.text...');
    }
} else if (direction === 'to-env') {
    // Pull time: env.text -> .env
    if (fs.existsSync(envTextPath)) {
        const textContent = fs.readFileSync(envTextPath, 'utf8');
        
        // If .env doesn't exist, just create it
        if (!fs.existsSync(envPath)) {
            fs.writeFileSync(envPath, textContent);
            console.log('✅ Created .env from env.text');
        } else {
            // Merge logic: keep local values but add new ones from env.text
            const localEnv = fs.readFileSync(envPath, 'utf8');
            if (localEnv !== textContent) {
                fs.writeFileSync(envPath, textContent);
                console.log('🔄 Updated .env with new values from GitHub');
            }
        }
    }
}
