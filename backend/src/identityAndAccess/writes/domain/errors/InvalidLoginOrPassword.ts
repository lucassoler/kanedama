import { DomainError } from "../../../../sharedKernel/domainError";
import IdentityErrorCodes from "./IdentityErrorCodes";

export class InvalidLoginOrPassword extends DomainError {
    code: string = IdentityErrorCodes.InvalidLoginOrPassword;

    constructor() {
        super("invalid login or password");
    }
}
