import { ExpressServerHelper } from "../../../../tests/integration/helpers/expressServerHelper";
import request from 'supertest';
import { LoginCommand } from "../../../writes/usecases/LoginCommand";
import { LoginCommandHandler } from "../../../writes/usecases/LoginCommandHandler";

const spy = LoginCommandHandler.prototype.handle = jest.fn();

describe('REST - Login', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('login succeed', async () => {
        spy.mockImplementation(() => {
            return Promise.resolve({ name: "Jane Doe" });
        });

        const res = await request(server.get())
            .post('/api/identity/login')
            .send({
                login: "Jane Doe",
                password: "Password"
            });

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({
            name: "Jane Doe"
        });

        expect(spy).toHaveBeenCalledWith(new LoginCommand("Jane Doe", "Password"));
    });
});