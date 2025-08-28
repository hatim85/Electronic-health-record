function getCallerAttributes(ctx) {
    const role = ctx.clientIdentity.getAttributeValue('role');
    const uuid = ctx.clientIdentity.getAttributeValue('uuid');

    if (!role || !uuid) {
        console.log('Caller attributes missing role or uuid:', { role, uuid });
        // throw new Error('Missing role or uuid in client certificate');
        return { role: role, uuid: uuid };
    }
    return { role, uuid };
}

module.exports = { getCallerAttributes };
