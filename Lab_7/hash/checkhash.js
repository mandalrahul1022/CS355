const bcrypt = require('bcrypt');
const fs = require('fs');

const HASH_FILE = 'password.txt';

async function main() {
    const password = process.argv[2];
    if (!password) {
        console.error('Please provide a password to check.');
        return;
    }
    const hash = fs.readFileSync(HASH_FILE, 'utf8');
    const match = await bcrypt.compare(password, hash);
    console.log(match ? 'Password matches!' : 'Password does not match.');
}

main();
