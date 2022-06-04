import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class EmailAlreadyUsed extends DomainError {
    readonly code = IdentityErrorCodes.EmailAlreadyUsed;

    constructor(email: string) {
        super(`email "${email}" is already used by another registered user`);
    }
}
