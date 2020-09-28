import Node from './node';
import getOctPosition from './get-oct-position';

export default function recursiveGetNodeValue<T>(node: Node<T>, x: number, y: number, z:number) : T {
    if(node.children) {

        // Determine which OctPosition we need to examine
        const nodeMid = node.mid!;
        const OctPosition = getOctPosition(nodeMid.x, nodeMid.y, nodeMid.z, x, y, z);

        let childNode = node.children[OctPosition];
        // Recurse if we found a child.
        if(childNode) return recursiveGetNodeValue(childNode, x, y, z);
    }

    // Otherwise our value is the right one.
    return node.value;
}
