import clz32 from './clz-32';

/**
 * Given any set of dimensions, provide the proper volumetric depth that will 
 * contain the entire given volume.

 * Power of 2 dimensional trees (binary trees, quadtrees, octrees) work best
 * when all of their dimensions are equal, and a power of two.
 * 
 * @param dimensions One or more width, height and depth values for the volume
 *                   to be considered in an octree. At least one must be provided.
 * @returns The depth that all dimensions of the tree needs to be in order to 
 *          contain the specified volume. 
 */
export default function calculateBestDepth(dimensions: { width?: number, height?: number, depth?: number}) : number {
    const { width, height, depth } = dimensions;
    const maxDimension = Math.max(width||0, height||0, depth||0);

    if(!maxDimension) throw new Error("At least one dimension of 'width', 'height', or 'depth' must be provided and greater than 0.")

    // If it is already a power of 2, we're done.
    if((maxDimension & (maxDimension -1)) == 0) return maxDimension;

    // Find out how many leading zeros there are in the max dimension
    const leadingZeros = clz32(maxDimension);

    // Use the leading zero count to discover the containing power of two.
    const powerOfTwo = 1 << (32 - leadingZeros);
    return powerOfTwo;
}