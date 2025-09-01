"use strict";

const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const masterKey = Buffer.from(process.env.WALLET_ENCRYPTION_KEY, 'hex');

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
    
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();

    return {
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        encryptedData: encrypted.toString('base64')
    };
}



function decrypt(encryptedPayload) {
    const iv = Buffer.from(encryptedPayload.iv, 'base64');
    const authTag = Buffer.from(encryptedPayload.authTag, 'base64');
    const encryptedData = Buffer.from(encryptedPayload.encryptedData, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}
// const encryptedPayload={
//   "iv": "JFNUugO+PCTad/As",
//   "authTag": "fr1Q1oGduStzfTumJZhelg==",
//   "encryptedData": "Ny1QC4rpvfe5VBSYuImECX+aail7dgeyueZUqzYAr4wuH+fRoevvYhljmvlYibrOJ1muV9mNWL0/Rf12gSMZFU4+KfD8xzkX8Ad4KVF3yU3tS7f0UkCXQ3xqb8Lk1lYKiQbdb6wFtIlTagwnhjs9XgZDJFsOKt3CtvYz/nfuf14NN4NCos9NrZWExV7WJxxQNEHWL27yD4KrXwwE0ZrXF85qV5dMIBuhhCKMEr547NwKUPkkrQ6o+I3apSEr3vCoRyQJfbp3VOM6+ZTmtoO+mWG5ZFisgv686sKFovASINbxE41YRfLWG0tS0e6xKtfxjIeSapqZDE4OecxfOjS8bJgG2rJt9zJinziav8VC3sYc0OrME0R7F3qeYquMm6jCOpUVz0u3td9ab133hs5QQ4SRlyheVqTpQ+/JxQotSrAL4ICnsCO36gXeR9bUfZXO1z7lED6GSSXOiRmv617Ag0si7jjsN/nKv5W5KUxkaNilcX+hB15yU43PNJLe09w13F8uVe8ujaA5wChUE+gBVbPsmx7ERt/GfHVhutKbmT20zlW9ys1FI17xs2WSUlIRvd2vuJp+7wQyBHzvfg3/6lamnUcgcedaArKbN3BUJq+G/6T8HvJJ4K/dpyRXL7YmaY7DlPbZ5BFYZ20Gp2MgXnUhxXsMy5elqnQos6KsTdzRm78PqliPRc/jztohcrTSY/O4cOyGPkMNIcNfGqdXTTtxiPB4mJd9L0XzwatQZeWrq/C59roxNhbHfpWOkxD+X3YxGqytLEBAT4P73RGqorN/+eiB/VFsaTECthvICQmF9OACSr7zaJIxwLvabQKiXVfPetc78XajT+CS1XY1N6pP1PATekhSNnKdzPx4Pk3bABvXAuW+WMQ1mw2Z7361o3S+Xq5g7fLJDqgVXqQOgyxhNTj6kdaoZI34YOynwc8twFbzAHvzmzqia4fB2QMdsTDdhf5zk3qBwYAIBi8OgXjs1/tgXVQAYDR10cneJEBQDA7faO4vqFoRTdvSHK01jDiKf2e9Md5buMQxgG6WEaNO0cAn0JRFy/y6OQVXu2uR8nrd0ctHBGAfQHu3ur7L1av85wFd9mfkoAKujcaDJpdEEJR+ZAp1ZCzy+20BhHRpmG4GI3I0VGyq7SnTFejOeFUyd6Y5tg0IHU+6dMvW6/Sglr8Ja5OdkFc4rVoiHiR/YEkfGcK2CkXglJKAEKGgScszLPIQhPqyVLdhLewbJInwjJAfVepAGPcsrLBvODrlWHRE9T+9M+fAIYCnPUTWSrSM7Tu6qHxkaF7rYs6efiEZKhpa70wNCjlN86tR61+JolcWmZcQNNqe89vUmYcomw85IknPC7JswpOi2WhhYTqKr6Y7gi/sT85TbHp3zlYfKl6HifP9nIA2+MLJ66X9oZan1UEhgWIcJk62R0riIAU3lJOrPrjW7041e4/LNFUZicRwG/IOePnU0xQnenIkn6o/kEerBoDjLRH79feGPu36fin7Bib+CtMV3yYNrt6BgqhhLnsC/VBItAioPDacj3c0SVi5exABMHlg+QEMJfeb71eKjgutZswAjmDooogYe+mrjR4T/UYpbDNm4xWv7Kg2TdUDIUzu/row85dGPnTnkgLVHue4oovDrgehC2Z745/SUzbeqEnP1tQdMhpLvqAQePiJKKb4KIJeTfjSxE5DxaAMSLXsAOv3ed90qfgsUd7fOeIaBiZDRRniaNUi0SYozLBUaOub+bCnfLcA9ZPP2l2h4QVDUm/tky/+GG1tT9YcHXauORZEoaM7+S9A/Pu0O02UpabvS6KHhMLd/UVfcbNcCXL+D53oSrXYGvZe2IXldNjPGWBpdZHXexbwa/0Pkn07V5Snu1/I59AEIIjXm7IQIr2vMgkZOYCttpBfNRaChxiBuN8xDgbOgXK6qVYahefSWJ6S7OXMOTyGocF1wobB"
// }
// decrypt(encryptedPayload);


module.exports = { encrypt, decrypt };