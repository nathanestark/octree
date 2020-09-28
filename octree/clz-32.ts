// Basic clz32 implementation in case the newer Math version isn't available.
// If we're babeling we shouldn't have to worry about this sort of thing.
export function clz32_custom(value: number) : number {
    // 0 is a special case.
    if(value == 0) return 32;

    let leadingZeros = 0;
    // Shift left then right again. If we still equal our original
    // value, then we only shifted past 0s. Otherwise, we hit our first 1
    // and should stop.
    // Example: 64 > n > 32
    // Original:  
    //   0000 0000  0000 0000  0000 0000  001x xxxx
    //   [---------------------------------] 26 leading zeros
    // Shift left 10 times:
    //   00 0000  0000 0000  001x xxxx
    //   [--------------------] Still 16 leading zeros left
    // Shift left 27 times:
    //   x xxxx
    //   We've just nuked the leading 1. Shifting right results in a different value:
    //   0000 0000  0000 0000  0000 0000  000x xxxx
    //                                      ^ Used to be a 1
    while((value << leadingZeros >> leadingZeros) == value) leadingZeros++;
    return leadingZeros;
}

const clz32 = Math.clz32 || clz32_custom;

export default clz32;