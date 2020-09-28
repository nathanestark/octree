import { clz32_custom as clz32 } from '../octree/clz-32';

test('Test conditions for clz32', () => {
    expect(clz32(0)).toBe(32);
    expect(clz32(1)).toBe(31);
    expect(clz32(8)).toBe(28);
    expect(clz32(15)).toBe(28);
    expect(clz32(16)).toBe(27);
    expect(clz32(17)).toBe(27);
    expect(clz32(32)).toBe(26);
    expect(clz32(33)).toBe(26);
})