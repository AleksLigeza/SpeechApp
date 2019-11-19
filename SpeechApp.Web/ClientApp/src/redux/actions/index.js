export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_RIGHT = "MOVE_RIGHT";
export const MOVE_UP = "MOVE_UP";
export const MOVE_DOWN = "MOVE_DOWN";
export const INITIALIZE = 'INITIALIZE';
export const RESET = "RESET";

export const moveLeft = () => ({ type: MOVE_LEFT });  
export const moveRight = () => ({ type: MOVE_RIGHT });  
export const moveUp = () => ({ type: MOVE_UP });  
export const moveDown = () => ({ type: MOVE_DOWN });  
export const reset = () => ({ type: RESET });  
export const initialize = () => ({ type: INITIALIZE });  
