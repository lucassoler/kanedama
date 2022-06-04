import request from 'supertest';
import { ExpressServerHelper } from '../../../tests/integration/helpers/expressServerHelper';

describe('REST - Register User', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('register user succeed', async () => {
        const res = await request(server.get()).post('/api/identity/register').send();
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
    });
});