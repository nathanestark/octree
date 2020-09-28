import Node from './node';
import OctPosition from './oct-position';
import recursiveGetNodeValue from './recursive-get-node-value';
import recursiveSetNodeValue from './recursive-set-node-value';

/**
 * A volumetric Octree implementation.
 * The entire tree defines a 'value' for all spaces in the octree,
 * allowing children to define a different value than each parent. Usage
 * allows a rapid O(logn) time for gets and sets due to
 * the static depth. Self-balancing of the tree on value set should
 * provide a practical value get speed which can be much less than O time.
 * 
 * Example usage: voxel storage
 */
export default class Octree<T> {
    private root : Node<T>
    
    /**
     * 
     * @param depth The larges width/height/depth of a volume so that the tree will
     *              completely contain the volume. Note this value needs to be a power
     *              of 2. Use function `calculateBestDepth` to determine this.  
     * @param rootValue The value that all leaves of the entire tree will start with. 
     */
    constructor(depth: number, rootValue: T) {
        // Depth must be a positive integer
        if(!Number.isInteger(depth)) throw new Error("Depth must be an integer");
        if(depth <= 0) throw new Error("Depth must be positive");
        if((depth & (depth-1)) != 0) throw new Error("Depth must be a power of 2");
        
        if(depth == 1) {
            // We are an atomic leaf.
            this.root = {
                value: rootValue,
                depth: depth
            }
        } else {
            const halfDepth = depth/2;
            this.root = { 
                value: rootValue, 
                depth: depth,
                mid: { x: halfDepth, y: halfDepth, z: halfDepth},
                children: [
                    null, null, null, null,
                    null, null, null, null,
                ]
            };
        }
    }

    /**
     * Given a specific V3 coodrinate, determine the value of that location.
     */
    getValue(x: number, y: number, z: number) : T {
        // We don't expect depths of more than 32, so a likely performance
        // pentality for recursion here can mostly be ignored. 
        return recursiveGetNodeValue<T>(this.root, x, y, z);
    }

    /**
     * Given a specific V3 coodrinate, set the value of that location.
     */
    setValue(x: number, y: number, z: number, value: T) {
        // We don't expect depths of more than 32, so a likely performance
        // pentality for recursion here can mostly be ignored. 
        recursiveSetNodeValue<T>(this.root, x, y, z, value);
    }

    /**
     * Visits each node in the tree, invoking the callback 'fn'
     * for each. Visiting stops when 'fn' returns true.
     * Traversal is breadth first by default.
     * 
     * @param fn Callback function invoked when each node is
     *           visited. Return 'true' to stop visiting, or
     *           'false' to continue.
     * @param depthFirst Optional control to visit using a depth
     *                   first algorithm. False by default,
     *                   indicating a breadth first algorithm.
     */
    visit(fn: (node : Node<T>, octPosition: OctPosition|undefined, i: number) => boolean, depthFirst?: boolean) {
        let nodes : Array<{node: Node<T>, octPosition?: OctPosition }> 
            = [{ node: this.root }];
        let count = 0;
        while(nodes.length > 0) {
            // Decide on depth or breadth first
            const node = depthFirst ? nodes.pop()! : nodes.shift()!;

            // Invoke the callback
            const cancel = fn(node.node, node.octPosition, count++);

            // Escape if asked to
            if(cancel) return;

            // Add any children.
            if(node.node.children) {
                nodes = nodes.concat(
                    node.node.children!
                    .reduce((prev, c, i) => {
                        // If nothing there, don't add.
                        if(c == null) return prev;

                        // Add child
                        const octPosition : OctPosition = i;
                        return prev.concat({ node: c, octPosition: octPosition })
                    }, [] as Array<{ node: Node<T>, octPosition?: OctPosition }>)
                );
            }
        }
    }

    // TODO: Implement a load/save that is agnostic from storage.
    // I.e. we want it to work in a server nodejs envrionment (fs, or 
    // cloud storage like s3, dynamodb ect.) or from the browser 
    // (load from path/api/websocket, save to path/api/websocket).
    // 
    // Set is less useful here because it builds from the atomic leaf up.
    // We want a save to build from the root down to eliminate redundant
    // object creation.
}

