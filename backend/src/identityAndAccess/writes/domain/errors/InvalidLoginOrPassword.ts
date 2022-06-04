import { DomainNotFoundError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class InvalidLoginOrPassword extends DomainNotFoundError {
    code: string = IdentityErrorCodes.InvalidLoginOrPassword;

    constructor() {
        super("invalid login or password");
    }
}
