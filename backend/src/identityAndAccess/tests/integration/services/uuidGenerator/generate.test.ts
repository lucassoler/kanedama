import { V4UuidGenerator } from "../../../../writes/driven/services/V4UuidGenerator";

describe('Services - V4 UuidGenerator', () => {
    let uuidGenerator: V4UuidGenerator;
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    beforeEach(() => {
        uuidGenerator = new V4UuidGenerator()
    });

    test('should generate a new uuid', async () => {
        const uuid = await uuidGenerator.generate();
        expect(regexExp.test(uuid)).toBeTruthy();
    });
});