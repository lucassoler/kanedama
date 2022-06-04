export interface EncryptionService {
    compare(encryptedPassword: string, password: string): Promise<boolean>;
    encrypt(password: string): Promise<string>;
}
