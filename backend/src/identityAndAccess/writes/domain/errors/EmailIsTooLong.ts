import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class EmailIsTooLong extends DomainError {
    readonly code = IdentityErrorCodes.EmailIsTooLong;

    constructor(email: string) {
        super(`email "${email}" is too long`);
    }
}
