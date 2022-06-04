import { EncryptionService } from "../../domain/services/EncryptionService";

export class FakeEncryptionService implements EncryptionService {
    encrypt(password: string): Promise<string> {
        return Promise.resolve(this.encryptPassword(password));
    }
    compare(encryptedPassword: string, password: string): Promise<boolean> {
        return Promise.resolve(encryptedPassword === this.encryptPassword(password));
    }

    private encryptPassword = (password: string): string | PromiseLike<string> => {
        return `${password}_ENCRYPTED`;
    }
}
