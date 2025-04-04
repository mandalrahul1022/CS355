const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const SYM_KEY_LEN = 16;
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;
const ASYM_HASH = 'sha256';

const publicKey = fs.readFileSync('public.pem', 'utf8');
const aesKey = crypto.randomBytes(SYM_KEY_LEN);
const iv = crypto.randomBytes(SYM_KEY_LEN);

const messages = [
    'Hello world!',
    'This is secret.',
    'Encryption is fun!'
];

function aesEncrypt(text, key, iv) {
    const cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('base64');
}

function rsaEncrypt(data, publicKey) {
    return crypto.publicEncrypt({
        key: publicKey,
        padding: ASYM_PAD,
        oaepHash: ASYM_HASH
    }, data).toString('base64');
}

const encryptedKey = rsaEncrypt(aesKey, publicKey);
const encryptedIV = rsaEncrypt(iv, publicKey);
const encryptedMessages = messages.map(msg => aesEncrypt(msg, aesKey, iv));

const output = {
    key: encryptedKey,
    iv: encryptedIV,
    data: encryptedMessages
};

fs.writeFileSync('messages.json', JSON.stringify(output, null, 2));
console.log('Messages encrypted and saved.');