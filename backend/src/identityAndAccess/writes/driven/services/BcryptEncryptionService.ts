import { EncryptionService } from "../../domain/services/EncryptionService";
import bcrypt from 'bcryptjs';
import { EnvironmentVariables } from "../../../../configuration/environment/environmentVariables";

export class BcryptEncryptionService implements EncryptionService {
    constructor(private readonly environmentVariables: EnvironmentVariables) {
    }

    async encrypt(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.environmentVariables.SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return Promise.resolve(hash);
    }

    async compare(encryptedPassword: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }
}
