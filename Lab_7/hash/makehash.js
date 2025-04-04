const bcrypt = require('bcrypt');
const fs = require('fs');

const SALT_ROUNDS = 10;
const HASH_FILE = 'password.txt';

async function main() {
    const password = process.argv[2];
    if (!password) {
        console.error('Please provide a password as an argument.');
        return;
    }
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    fs.writeFileSync(HASH_FILE, hashed);
    console.log('Password hashed and saved.');
}