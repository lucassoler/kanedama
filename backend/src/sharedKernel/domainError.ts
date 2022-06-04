export abstract class DomainError extends Error {
    abstract readonly code: string;
    constructor(message: string) {
        super(message);
    }
}