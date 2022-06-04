import request from 'supertest';
import { ExpressServerHelper } from '../../../tests/integration/helpers/expressServerHelper';
import { PasswordIsNotLongEnough } from '../../writes/domain/errors/PasswordIsNotLongEnough';
import { UserInvalid } from '../../writes/domain/errors/UserInvalid';
import { UserNameAlreadyUsed } from '../../writes/domain/errors/UserNameAlreadyUsed';
import { RegisterUserCommand } from '../../writes/usecases/RegisterUserCommand';
import { RegisterUserCommandHandler } from '../../writes/usecases/RegisterUserCommandHandler';

const spy = RegisterUserCommandHandler.prototype.handle = jest.fn();

describe('REST - Register User', () => {
    let server = new ExpressServerHelper();

    afterAll(() => {
        server.stop();
    });

    test('succeed', async () => {
        const res = await validRequest();

        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual({});
        expect(spy).toHaveBeenCalledWith(new RegisterUserCommand("Jane Doe", "jane.doe@gmail.com", "Password"));
    });

    test('failed with invalid parameters', async () => {
        const res = await request(server.get())
            .post('/api/identity/register')
            .send({
                name: 1234, 
                email: 12345, 
                password: 123456
            });

        expect(res.status).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.errors).toStrictEqual([
            {
                "message": "name must be a valid string", 
                "param": "name"
            }, {
                "message": "email must be a valid string", 
                "param": "email"
            }, {
                "message": "password must be a valid string",
                "param": "password"
            }
        ]);
    });

    test('failed with missing parameters', async () => {
        const res = await request(server.get())
            .post('/api/identity/register')
            .send();

        expect(res.status).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");
        expect(res.body.errors).toStrictEqual([
            {
                "message": "name is required", 
                "param": "name"
            }, {
                "message": "name must be a valid string", 
                "param": "name"
            }, {
                "message": "email is required", 
                "param": "email"
            }, {
                "message": "email must be a valid string", 
                "param": "email"
            }, {
                "message": "password is required", 
                "param": "password"
            }, {
                "message": "password must be a valid string",
                "param": "password"
            }
        ]);
    });

    test('failed with domain validation errors', async () => {
        spy.mockImplementation(() => {
            throw new UserInvalid([
                new UserNameAlreadyUsed("jane doe"),
                new PasswordIsNotLongEnough("azerty")
            ]);
        });

        const res = await validRequest();

        expect(res.status).toBe(400);
        expect(res.body.error_name).toBe("BadRequest");

        expect(res.body.errors).toStrictEqual([{
            code: "IDENTITY_ERR_4008",
            message: 'name "jane doe" is already used by another registered user'
        }, {
            code: "IDENTITY_ERR_4003",
            message: 'password "azerty" is not long enough'
        }]);
    });

    test('failed with an unknown error', async () => {
        spy.mockImplementation(() => {
            throw new Error("unknown");
        });

        const res = await validRequest();

        expect(res.status).toBe(500);
        expect(res.body.error_name).toBe("Internal Server Error");
    });

    async function validRequest() {
        return await request(server.get())
            .post('/api/identity/register')
            .send({
                name: "Jane Doe",
                email: "jane.doe@gmail.com",
                password: "Password"
            });
    }
});