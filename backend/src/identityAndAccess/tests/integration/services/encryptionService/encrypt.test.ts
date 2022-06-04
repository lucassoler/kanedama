import { EncryptionService } from "../../../../writes/domain/services/EncryptionService";
import bcrypt from 'bcrypt';
import { EnvironmentVariables, NodeEnvironmentVariables } from "../../../../../configuration/environment/environmentVariables";

describe('Service - Bcrypt Encryption Service', () => {
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

class BcryptEncryptionService implements EncryptionService {
    constructor(private readonly environmentVariables: EnvironmentVariables) {
        
    }
    async encrypt(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.environmentVariables.SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return Promise.resolve(hash);
    }
}