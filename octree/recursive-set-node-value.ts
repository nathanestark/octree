import Node, { ChildNode } from './node';
import OctPosition from './oct-position';
import getOctPosition from './get-oct-position';

export default function recursiveSetNodeValue<T>(node: Node<T>, x: number, y:number, z:number, value: T) : void {

    // If node is an atomic leaf, set it.
    // This should be a rare condition, since we don't
    // recurse to those nodes.
    if(node.depth == 1) node.value = value;
    else {

        const nodeMid = node.mid!;
        // Determine which OctPosition we need to examine
        const octPosition = getOctPosition(nodeMid.x, nodeMid.y,nodeMid.z, x, y, z);

        let childNode : ChildNode<T> = node.children ? node.children[octPosition] : null;
        // If child is an atomic leaf, we need to set the value,
        // or clear the childnode (if new value is our value).
        if(childNode && childNode.depth == 1) {
            const children = node.children!;
            if(value == node.value) {
                children[octPosition] = null;
                // If we now have no children, remove the array
                if(children.filter(c => c != null).length == 0) delete node.children;
            }
            else {
                childNode.value = value;

                // We should test if we need to balance this part of the tree.
                const [hasParentValue, hasNewValue] = groupCount(children, 
                    c => c == null, // hasParentValue
                    c => c!.value == value // hasNewValue
                );
                if(hasParentValue < hasNewValue) {
                    // Convert the parent into the new value
                    for(let i=0;i<children.length;i++) {
                        const child = children[i];
                        // Fill in missing children
                        if(child == null) {
                            children[i] = generateChild(node, i);
                        } 
                        // And clear out children with the new value.
                        else if(child.value == value) {
                            children[i] = null;
                        }
                    }
                    // Then update parent's value.
                    node.value = value;     
                }       
            }
        }
        // If the node doesn't exist, has children, or has a value different 
        // than what we are setting, then we need to recurse. 
        else if(!childNode || childNode.children || childNode.value != value) {
            // Create the new child node if it doesn't exist.
            if(!childNode) {
                // Note we use the parent value here for the new node.
                childNode = generateChild(node, octPosition);

                // Give the node some children if it didn't have them
                if(!node.children) {
                    node.children = [
                        null,null,null,null,
                        null,null,null,null
                    ];
                }
                node.children[octPosition] = childNode;
            }

            if(childNode.depth > 1) {
                // Continue setting.
                recursiveSetNodeValue(childNode, x,y,z, value);
            } else {
                // Or set the value
                childNode.value = value;
            }

            // We have some tree work to do if the child is now empty.
            if(childNode.children == null) {
                const children = node.children!;
                // If the new value is the parent's value, then we can drop
                // the child node.
                if(value == node.value) {
                    children[octPosition] = null;
                    // If we now have no children, remove the array
                    if(children.filter(c => c != null).length == 0) delete node.children;
                }
                // Otherwise we may need to balance the tree.
                else {
                    // If node has more EMPTY children with newValue than
                    // null children (with the original value), we need to 'switch'
                    // node to the new type and clean up the children.
                    const [hasParentValue, hasNewValue] = groupCount(children, 
                        c => c == null, // hasParentValue
                        c => c!.value == value && c!.children == null // hasNewValue
                    );
                    if(hasParentValue < hasNewValue) {
                        // Convert the parent into the new value
                        for(let i=0;i<children.length;i++) {
                            const child = children[i];
                            // Fill in missing children
                            if(child == null) {
                                children[i] = generateChild(node, i);
                            } 
                            // And clear out children with the new value.
                            else if(child.value == value && child.children == null) {
                                children[i] = null;
                            }
                        }
                        // Then update parent's value.
                        node.value = value;     
                    }       
                } 
            }
        }
    }
}

// Sort into groups (one group per item), priority going to
// previous filter functions, and return the count for each.
// We only have to loop once vs multiple filter calls.
function groupCount<T>(list: Array<T>, ...filterFn: Array<((value: T) => boolean)>) : Array<number> {
    const ret : Array<number> = filterFn.map(f => 0);
    
    return list.reduce((prev, item) => {
        const index = filterFn.findIndex(fn => fn(item));
        if(index >= 0) prev[index]++;
        return prev;
    }, ret);
}

// Generate a new child from given information
function generateChild<T>(parent: Node<T>, octPosition: OctPosition) : Node<T> {
    const cDepth = parent.depth/2;


    // Is this an atomic leaf?
    if(cDepth == 1) {
        return {
            value: parent.value,
            depth: cDepth
        };
    }

    const halfDepth = cDepth/2;
    const pMid = parent.mid!;
    const mid = { 
        x: pMid.x 
            + ((octPosition & OctPosition.Right) == OctPosition.Right 
                ? halfDepth
                : -halfDepth), 
        y: pMid.y 
            + ((octPosition & OctPosition.Bottom) == OctPosition.Bottom 
                ? halfDepth
                : -halfDepth), 
        z: pMid.z 
            + ((octPosition & OctPosition.Front) == OctPosition.Front 
                ? halfDepth
                : -halfDepth)
    };

    return { 
        value: parent.value,
        depth: cDepth,
        mid: mid
    }

}