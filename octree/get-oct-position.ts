import OctPosition from './oct-position';

/**
 * Determine the OctPosition of a V3 point based on the midpoint we
 * are dealing with.
 * @param midX 
 * @param midY 
 * @param midZ 
 * @param x 
 * @param y 
 * @param z 
 */
export default function getOctPosition(
    midX: number, 
    midY: number, 
    midZ: number, 
    x: number, 
    y: number, 
    z: number
) : OctPosition {
    // Each OctPosition is a number from 0 to 7
    // Each bit in that number indicates position in
    // V3 space
    // 0xx - 0=Back, 1=front
    // x0x - 0=Top, 1=Bottom
    // xx0 - 0=Left, 1=Right

    let nOctPosition : number = 0;
    // Right or Left
    nOctPosition |= (x >= midX ? 1 : 0) << 0;
    // Top or Bottom
    nOctPosition |= (y >= midY ? 1 : 0) << 1;
    // Front or Back
    nOctPosition |= (z >= midZ ? 1 : 0) << 2;
    
    return nOctPosition as OctPosition;
}

