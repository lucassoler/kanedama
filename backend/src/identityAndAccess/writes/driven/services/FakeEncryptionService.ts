import { EncryptionService } from "../../domain/services/EncryptionService";

export class FakeEncryptionService implements EncryptionService {
    encrypt(password: string): Promise<string> {
        return Promise.resolve(`${password}_ENCRYPTED`);
    }
}
