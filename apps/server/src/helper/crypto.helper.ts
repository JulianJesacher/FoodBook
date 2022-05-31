import crypto = require('crypto');

export function getHash(input: string): string {
    return crypto.createHash('sha256')
        .update(input)
        .digest('hex');
}