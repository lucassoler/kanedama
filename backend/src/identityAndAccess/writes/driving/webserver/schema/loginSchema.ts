import { Schema } from "express-validator";

export const loginSchema = (): Schema => {
    return {
        "login": {
            in: 'body',
            exists: {
                errorMessage: "login is required"
            },
            isString: {
                errorMessage: 'login must be a valid string',
                bail: true
            },
            trim: true
        },
        "password": {
            in: 'body',
            exists: {
                errorMessage: "password is required"
            },
            isString: {
                errorMessage: 'password must be a valid string',
                bail: true
            },
            trim: true
        },
    }
};