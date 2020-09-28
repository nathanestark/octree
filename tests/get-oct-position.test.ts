import getOctPosition from '../octree/get-oct-position';
import OctPosition from '../octree/oct-position';

test('Test conditions for getOctPosition', () => {
    expect(getOctPosition(8, 8, 8, 0, 0, 0)).toBe(OctPosition.BackTopLeft);
    expect(getOctPosition(8, 8, 8, 15, 1, 7)).toBe(OctPosition.BackTopRight);
    expect(getOctPosition(8, 8, 8, 5, 10, 2)).toBe(OctPosition.BackBottomLeft);
    expect(getOctPosition(8, 8, 8, 11, 9, 4)).toBe(OctPosition.BackBottomRight);

    expect(getOctPosition(8, 8, 8, 0, 3, 10)).toBe(OctPosition.FrontTopLeft);
    expect(getOctPosition(8, 8, 8, 8, 7, 13)).toBe(OctPosition.FrontTopRight);
    expect(getOctPosition(8, 8, 8, 4, 8, 15)).toBe(OctPosition.FrontBottomLeft);
    expect(getOctPosition(8, 8, 8, 9, 12, 11)).toBe(OctPosition.FrontBottomRight);
})