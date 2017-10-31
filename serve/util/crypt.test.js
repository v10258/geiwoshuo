const {encode, test} = require('./crypt');

describe('encode', () => {

    const password = 'hello';

    it('hash', async () => {
        const hash = await encode(password);
        expect(hash).toBeTruthy();
    });

    it('match', async () => {
        const hash = await encode(password);
        expect(await test(password, hash)).toBe(true);
    })
});
