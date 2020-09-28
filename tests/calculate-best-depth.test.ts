import calculateBestDepth from '../octree/calculate-best-depth';

test('Test conditions for calculateBestDepth', () => {
    expect(() => calculateBestDepth({ width: 0, height: 0, depth: 0 })).toThrow();

    expect(calculateBestDepth({ width: 1, height: 1, depth: 1 })).toBe(1);
    expect(calculateBestDepth({ width: 8, height: 0, depth: 0 })).toBe(8);
    expect(calculateBestDepth({ width: 0, height: 0, depth: 15 })).toBe(16);
    expect(calculateBestDepth({ width: 0, height: 16, depth: 0 })).toBe(16);
    expect(calculateBestDepth({ width: 17, height: 17, depth: 1 })).toBe(32);
    expect(calculateBestDepth({ width: 20, height: 32, depth: 32 })).toBe(32);
    expect(calculateBestDepth({ width: 33, height: 33, depth: 33 })).toBe(64);
    expect(calculateBestDepth({ width: 100, height: 10, depth: 33 })).toBe(128);
    expect(calculateBestDepth({ width: 32, height: 1000, depth: 133 })).toBe(1024);
})