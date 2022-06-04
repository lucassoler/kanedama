export abstract class DomainError extends Error {
    abstract readonly code: string;
    readonly innerExceptions: Array<DomainError> = [];

    constructor(message: string) {
        super(message);
    }
}

export abstract class DomainValidationError extends DomainError {

}

export abstract class DomainNotFoundError extends DomainError {

}