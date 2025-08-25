/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require('fabric-contract-api');
const modules = require('./contracts');

class ehrChainCode extends Contract {
    constructor() {
        super('ehrChainCode');
    }
}

Object.entries(modules).forEach(([fnName, fnImpl]) => {
    ehrChainCode.prototype[fnName] = async function(ctx, args) {
        return fnImpl(ctx, args);
    };
});

module.exports = ehrChainCode;
