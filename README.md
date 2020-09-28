# An Octree implementation for storing voxel (Volumetric Pixel) information

## Purpose

Storing three dimensional volumetric data can become memory and storage intensive if done using a naive or brute force approach. Simply storing a matrix of information results in `n*n*n` pieces of information to store. By using an Octree (3d version of the more popular quadtree), we can efficiently aggregate adjacent voxels into a much smaller storage space, while still maintaining acceptable performance when setting or accessing the data. Storage performance does not decrease with the density of usage as long as the values used are clustered; a deliberate pattern must be attempted to maximize storage and decrease efficiency. Even in a fullly saturated tree, necessary storage will be less than double a standard matrix, and access time will at worst be O(log(n)).

## Installation

1. Clone the repository
2. `npm install`
3. `npm run build`

## Usage

This project is not currently exported to NPM. Create a local link dependency to the project for use.

In your project, import the Octree class.


### `new Octree(depth: number, rootValue: T)`

The Octree must be initialized with a volumetric depth that is a multiple of 2. If you have a size that doesn't match a multiple of two, use the `calculateBestDepth` function to obtain a depth that will contain your volume. You must also supply an initial value which all nodes of the tree will initially be set to.

```
const octree = new Octree(16, 'blue');
//                        ^    ^
//    Depth is a power of 2    We are storing a string, where all voxels
//                             have an initial value of 'blue'
```


### `setValue(x: number, y: number, z: number, value: T) : void`

Sets a value in the tree at the given voxel coordinate. Note that the coordinate is in localspace to the tree itself, which does not inherently exist in a more global space.

```
octree.setValue(7,15,1, 'red'); // Set this specific coordinate to red. 
```

When setting a value, the tree will self-balance and cull to maintain efficiency. For example, given a small 2x2x2 example initalized with value 'O', after initialization it will appear (back to front) as:
```
Matrix view:
z=0       z=1
    O O      O O
    O O      O O

Tree View (with no children):
        O
   / / | | \ \
```
If we call `setValue(0,0,0,'X');` we will end up with
```
Matrix view:
z=0       z=1
    X O      O O
    O O      O O

Tree View (1 child, 2 total nodes):
            O
     / / / / \ \ \ \
    X   
```
Setting up to 3 more adds more children: `setValue(1,0,0,'X'); setValue(0,1,0,'X'); setValue(1,1,0,'X');`
```
Matrix view:
z=0       z=1
    X X      O O
    X X      O O

Tree View (4 children, 5 total nodes):
            O
     / / / / \ \ \ \
    X X X X 
```
Adding one more forces the tree to self-balance: `setValue(0,0,1, 'X');`
```
Matrix view:
z=0       z=1
    X X      X O
    X X      O O

Tree View (3 children, 4 total nodes):
            X
     / / / / \ \ \ \
                O O O
```
Setting up to coordinates back to 'O' will cause another rebalance: `setValue(0,0,1, 'O'); setValue(1,1,0, 'O');`
```
Matrix view:
z=0       z=1
    X X      O O
    X O      O O

Tree View (3 children, 4 total nodes):
            O
     / / / / \ \ \ \
    X X X  
```

Resetting all remaining 'X' values to 'O' will cause the tree to cull unnecessary children: `setValue(0,1,0,'O'); setValue(1,0,0,'O'); setValue(0,0,0 'O');`
```
Matrix view:
z=0       z=1
    O O      O O
    O O      O O

Tree View (0 children, 1 total nodes):
            O
     / / / / \ \ \ \
```


### `getValue(x: number, y: number, z: number) : T`

Retreives a value from the tree given the coordinate of the voxel desired. Note that the coordinate is in localspace to the tree itself, which does not inherently exist in a more global space. All voxels in the tree have a value at all times. If a subdivision doesn't exist for the precise coordinates asked for then the value of the parent, or closest existing ancestor, is the value returned.
This call should be O(log(n)).

```
const value1 = octree.getValue(0,0,0); // value1 is 'blue'
const value2 = octree.getValue(7,15,1); // value2 is 'red'
```


### `visit(fn: (node : Node<T>, octPosition: OctPosition|undefined, i: number) => boolean, depthFirst?: boolean)`

Navigates through all existing nodes in the tree, and invokes `fn` for each node. The tree traversal is breadth-first by default; use argument `depthFirst` to do a depth-first traversal instead.

When `fn` is invoked on each node, the node itself, its position relative to its parent, and the 0 based count of nodes visited is passed to `fn`. `fn` must return `true` to continue visiting, or `false` to cancel.


## Tests

To run the tests use `npm run test`