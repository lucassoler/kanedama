import bcrypt from 'bcrypt';
import { NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";
import { BcryptEncryptionService } from "../../../../writes/driven/services/BcryptEncryptionService";

describe('Service - Bcrypt Encryption Service - Encrypt', () => {
    let encryptionService: BcryptEncryptionService;

    beforeEach(() => {
            encryptionService = new BcryptEncryptionService(new NodeEnvironmentVariables());
    });

    test('should encrypt my string', async () => {
        const hash = await encryptionService.encrypt("PASSWORD");
        expect(hash).not.toBe("PASSWORD");
        expect(bcrypt.compareSync("PASSWORD", hash)).toBeTruthy();
    });
});

