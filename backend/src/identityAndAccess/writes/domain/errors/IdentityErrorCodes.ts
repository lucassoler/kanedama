
export default class IdentityErrorCodes {
    private static readonly IDENTITY_ERROR_CODE = "IDENTITY_ERR_";

    static readonly UserInvalid = IdentityErrorCodes.concatErrorCode("4000");
    static readonly UserNameIsNotLongEnough = IdentityErrorCodes.concatErrorCode("4001");
    static readonly UserNameIsTooLong = IdentityErrorCodes.concatErrorCode("4002");
    static readonly PasswordIsNotLongEnough = IdentityErrorCodes.concatErrorCode("4003");
    static readonly PasswordIsTooLong = IdentityErrorCodes.concatErrorCode("4004");
    static readonly EmailIsTooLong = IdentityErrorCodes.concatErrorCode("4005");
    static readonly EmailIsNotInAValidFormat = IdentityErrorCodes.concatErrorCode("4006");
    static readonly EmailAlreadyUsed = IdentityErrorCodes.concatErrorCode("4007");
    static readonly UserNameAlreadyUsed = IdentityErrorCodes.concatErrorCode("4008");

    private static concatErrorCode(error: string) {
        return IdentityErrorCodes.IDENTITY_ERROR_CODE + error;
    }
}
