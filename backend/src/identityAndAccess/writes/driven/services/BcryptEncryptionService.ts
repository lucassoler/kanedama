import { EncryptionService } from "../../domain/services/EncryptionService";
import bcrypt from 'bcrypt';
import { EnvironmentVariables } from "../../../../configuration/environment/environmentVariables";

export class BcryptEncryptionService implements EncryptionService {
    constructor(private readonly environmentVariables: EnvironmentVariables) {
    }
    compare(encryptedPassword: string, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async encrypt(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.environmentVariables.SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return Promise.resolve(hash);
    }
}
