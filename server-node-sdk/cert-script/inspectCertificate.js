const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { X509Certificate } = require('crypto');

async function inspectCertificate() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('researchAdmin');
    if (!identity) {
        console.log('researchAdmin identity not found in wallet');
        return;
    }

    const cert = identity.credentials.certificate;
    const x509 = new X509Certificate(cert);
    console.log('Certificate Subject:', x509.subject);
    console.log('Certificate Extensions:', x509.toString());

    // Save certificate to file for manual inspection
    const certPem = cert.toString();
    fs.writeFileSync('researchAdmin-cert.pem', certPem);
    console.log('Certificate written to researchAdmin-cert.pem. Inspect it using OpenSSL.');
}

inspectCertificate();