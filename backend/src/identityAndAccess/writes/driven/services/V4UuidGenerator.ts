import { UuidGenerator } from "./UuidGenerator";
import { v4 as uuidv4 } from 'uuid';

export class V4UuidGenerator implements UuidGenerator {
    generate(): Promise<string> {
        return Promise.resolve(uuidv4());
    }
}
