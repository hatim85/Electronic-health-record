"use strict";

const { pinataClient } = require('./pinataClient');

async function unpin(cid) {
    if (!cid) {
        console.error("❌ ERROR: Please provide the CID as a command-line argument.");
        console.log("Example: node unpin.js Qm....");
        return;
    }

    try {
        console.log(`Attempting to unpin CID: ${cid}...`);
        const response = await pinataClient.delete(`/pinning/unpin/${cid}`);
        
        // A successful response is a 200 status code with no body.
        if (response.status === 200) {
            console.log(`✅ Successfully unpinned CID: ${cid}`);
        } else {
            console.log(`⚠️ Received status ${response.status}. Please verify on the Pinata website.`);
        }
    } catch (error) {
        console.error(`Failed to unpin ${cid}:`, error.response ? error.response.data : error.message);
    }
}

// Get the CID from the command line arguments
const cidToUnpin = process.argv[2];
unpin(cidToUnpin);