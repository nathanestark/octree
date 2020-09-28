export type ChildNode<T> = Node<T> | null;

export default interface Node<T> {
    value: T,
    depth: number,
    // Store the mid-point for each node
    // in order to limit the number of division calls we need to do.
    mid?: { x: number, y: number, z: number },
    children?: [
        ChildNode<T>, ChildNode<T>, ChildNode<T>, ChildNode<T>, 
        ChildNode<T>, ChildNode<T>, ChildNode<T>, ChildNode<T> 
    ],
};
