const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;
const ASYM_HASH = 'sha256';

function aesDecrypt(text, key, iv) {
    const decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
    let decrypted = decipher.update(Buffer.from(text, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

function rsaDecrypt(encrypted, privateKey) {
    return crypto.privateDecrypt({
        key: privateKey,
        padding: ASYM_PAD,
        oaepHash: ASYM_HASH
    }, Buffer.from(encrypted, 'base64'));
}

const privateKey = fs.readFileSync('private.pem', 'utf8');
const doc = JSON.parse(fs.readFileSync('messages.json'));

const key = rsaDecrypt(doc.key, privateKey);
const iv = rsaDecrypt(doc.iv, privateKey);

console.log('Decrypted messages:');
doc.data.forEach(msg => console.log(aesDecrypt(msg, key, iv)));
