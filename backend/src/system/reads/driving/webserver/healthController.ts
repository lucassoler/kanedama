import {Request, Response} from 'express';

export const healthController = () => {
    return async (request: Request, response: Response) => {
        response.status(200).json({});
    }
}