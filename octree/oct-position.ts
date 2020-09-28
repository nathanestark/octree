// Treat this as a bitmask for each of the three
// parts (back/front, top/bottom, left/right)
const enum OctPosition {

    Back = 0, Top = 0, Left = 0,
    Right = 1, Bottom = 2, Front = 4,

    BackTopLeft     = 0,
    BackTopRight    = 1,
    BackBottomLeft  = 2,
    BackBottomRight = 3,

    FrontTopLeft    = 4,
    FrontTopRight   = 5,
    FrontBottomLeft = 6,
    FrontBottomRight= 7 
}

export default OctPosition;