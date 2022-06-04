import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { BcryptEncryptionService } from "../../../../writes/driven/services/BcryptEncryptionService";
import bcrypt from 'bcrypt';

describe('Service - Bcrypt Encryption Service - Compare', () => {
    let encryptionService: BcryptEncryptionService;

    beforeEach(() => {
            encryptionService = new BcryptEncryptionService(new NodeEnvironmentVariables());
    });

    test('should return false if it does not match', async () => {
        const result = await encryptionService.compare(await encryptionService.encrypt("PASSWORD_1"), "PASSWORD_2");
        expect(result).toBeFalsy();
    });

    test('should return true if it does not match', async () => {
        const result = await encryptionService.compare(await encryptionService.encrypt("PASSWORD"), "PASSWORD");
        expect(result).toBeTruthy();
    });
});