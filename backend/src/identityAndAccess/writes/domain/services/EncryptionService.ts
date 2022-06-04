export interface EncryptionService {
    encrypt(password: string): Promise<string>;
}
