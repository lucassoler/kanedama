import {Request, Response} from 'express';

export const registerController = () => {
    return async (request: Request, response: Response) => {
        response.status(200).json({});
    }
}