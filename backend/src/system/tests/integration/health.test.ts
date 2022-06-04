import request from 'supertest';
import { ExpressServerHelper } from '../../../tests/integration/helpers/expressServerHelper';

describe('REST - Health check', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('app is healthy', async () => {
        const res = await request(server.get()).get('/api/healthz').send();
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
    });
});