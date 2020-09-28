import Octree from '../octree';
import Node from '../octree/node';

test('Test get + set for Octree', () => {
    // Initialize entire tree to 'A'
    const octree = new Octree(8, 'A');

    // Set some values.

    // Set whole bottom back right octent to 'O'
    for(let x=4;x<8;x++) {
        for(let y=4;y<8;y++) {
            for(let z=4;z<8;z++) {
                octree.setValue(x,y,z, 'O');
            }
        }
    }

    // Set top back left of bottom front right octent to 'W'
    for(let x=4;x<6;x++) {
        for(let y=4;y<6;y++) {
            for(let z=2;z<4;z++) {
                octree.setValue(x,y,z, 'W');
            }
        }
    }

    // Create checker board pattern in Top front right most with 'X'
    octree.setValue(0,0,0, 'X');
    octree.setValue(1,1,0, 'X');
    octree.setValue(1,0,1, 'X');
    octree.setValue(0,1,1, 'X');

    
    // Print the tree's values
    // let p = "";
    // for(let z=0;z<8;z++) {
    //     p += `${z}\r\n`;
    //     for(let y=0;y<8;y++) {
    //         for(let x=0;x<8;x++) {
    //             const v = octree.getValue(x,y,z);
    //             p += v + "  ";
    //         }
    //         p += "\r\n"
    //     }
    //     p += "\r\n";
    // }
    // console.log(p);
    
    // Ensure the total number of leaf nodes is what we expect
    // - 1 for root 
    // - 1 for BackTopLeft (Xs)
    // - 1 for BackBottomRight (Ws)
    // - 1 for FrontBottomRight (Os)
    // - 1 for BackTopLeft of BackTopLeft (Xs)
    // - 1 for FrontTopLeft of BackBottomRight (Ws)
    // - 4 for individual Xs
    let count = 0;
    octree.visit(() => { count++; return false; }, true);
    expect(count).toBe(10);

    // Retrieve and test.
    for(let x=4;x<8;x++) {
        for(let y=4;y<8;y++) {
            for(let z=4;z<8;z++) {
                expect(octree.getValue(x,y,z)).toBe('O');
            }
        }
    }
    

    // Set top back left of bottom front right octent to 'W'
    for(let x=4;x<6;x++) {
        for(let y=4;y<6;y++) {
            for(let z=2;z<4;z++) {
                expect(octree.getValue(x,y,z)).toBe('W');
            }
        }
    }
    expect(octree.getValue(4,4,1)).toBe('A');

    expect(octree.getValue(0,0,0)).toBe('X');
    expect(octree.getValue(1,0,0)).toBe('A');
    expect(octree.getValue(0,1,0)).toBe('A');
    expect(octree.getValue(1,1,0)).toBe('X');
    expect(octree.getValue(0,0,1)).toBe('A');
    expect(octree.getValue(1,0,1)).toBe('X');
    expect(octree.getValue(0,1,1)).toBe('X');
    expect(octree.getValue(1,1,1)).toBe('A');
    expect(octree.getValue(0,0,2)).toBe('A');


    // "reset" checker board pattern and test.
    octree.setValue(0,0,0, 'A');
    expect(octree.getValue(0,0,0)).toBe('A');
    octree.setValue(1,1,0, 'A');
    expect(octree.getValue(1,1,0)).toBe('A');
    octree.setValue(1,0,1, 'A');
    expect(octree.getValue(1,0,1)).toBe('A');
    octree.setValue(0,1,1, 'A');
    expect(octree.getValue(0,1,1)).toBe('A');


    // Ensure the total number of leaf nodes is what we expect after
    // removing the Xs
    // - 1 for root 
    // - 1 for BackTopLeft (Xs)
    // - 1 for BackBottomRight (Ws)
    // - 1 for FrontBottomRight (Os)
    // - 1 for BackTopLeft of BackTopLeft (Xs)
    // - 1 for FrontTopLeft of BackBottomRight (Ws)
    // - 4 for individual Xs
    count = 0;
    octree.visit(() => { count++; return false; });
    expect(count).toBe(4);
});