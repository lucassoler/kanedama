import request from 'supertest';
import { ExpressServerHelper } from '../../../tests/integration/helpers/expressServerHelper';
import { RegisterUserCommand } from '../../writes/usecases/RegisterUserCommand';
import { RegisterUserCommandHandler } from '../../writes/usecases/RegisterUserCommandHandler';

const spy = RegisterUserCommandHandler.prototype.handle = jest.fn();
describe('REST - Register User', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('register user succeed', async () => {
        const res = await request(server.get()).post('/api/identity/register').send({name: "Jane Doe", email: "jane.doe@gmail.com", password: "Password"});
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
        expect(spy).toHaveBeenCalledWith(new RegisterUserCommand("Jane Doe", "jane.doe@gmail.com", "Password"));
    });
});