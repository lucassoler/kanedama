import { ExpressServerHelper } from "../../../../tests/integration/helpers/expressServerHelper";
import request from 'supertest';
import { LoginCommand } from "../../../writes/usecases/LoginCommand";
import { LoginCommandHandler } from "../../../writes/usecases/LoginCommandHandler";
import { InvalidLoginOrPassword } from "../../../writes/domain/errors/InvalidLoginOrPassword";

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

    test('failed with invalid parameters', async () => {
        const res = await request(server.get())
            .post('/api/identity/login')
            .send({
                login: 1234, 
                password: 123456
            });

        expect(res.status).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.errors).toStrictEqual([
            {
                "message": "login must be a valid string", 
                "param": "login"
            }, {
                "message": "password must be a valid string",
                "param": "password"
            }
        ]);
    });

    test('failed with missing parameters', async () => {
        const res = await request(server.get())
            .post('/api/identity/login')
            .send();

        expect(res.status).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.errors).toStrictEqual([
            {
                "message": "login is required", 
                "param": "login"
            }, {
                "message": "login must be a valid string", 
                "param": "login"
            }, {
                "message": "password is required", 
                "param": "password"
            }, {
                "message": "password must be a valid string",
                "param": "password"
            }
        ]);
    });

    test('failed with domain error', async () => {
        spy.mockImplementation(() => {
            throw new InvalidLoginOrPassword();
        });

        const res = await request(server.get())
            .post('/api/identity/login')
            .send({
                login: "Jane Doe",
                password: "Password"
            });

        expect(res.status).toBe(404);
        expect(res.body.error_name).toBe("NotFound");

        expect(res.body.message).toBe("invalid login or password");
    });

    test('failed with an unknown error', async () => {
        spy.mockImplementation(() => {
            throw new Error("unknown");
        });

        const res = await request(server.get())
            .post('/api/identity/login')
            .send({
                login: "Jane Doe",
                password: "Password"
            });

        expect(res.status).toBe(500);
        expect(res.body.error_name).toBe("InternalServer");
        expect(res.body.message).toBe("Internal Server Error");
    });
});