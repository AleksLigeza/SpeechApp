import { INITIALIZE, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, RESET } from "../actions";
import { GameBoard } from '../../game/GameBoard'

export const gameBoardReducers = (state = GameBoard.getInitState(), action) => {
    var board = new GameBoard(state);
    switch (action.type) {
        case INITIALIZE: {
            board.restart();
            const result = board.toResult();
            return { ...state, ...result };
        }
        case MOVE_UP: {
            board.move('up');
            const result = board.toResult();
            return { ...state, ...result };
        }
        case MOVE_DOWN: {
            board.move('down');
            const result = board.toResult();
            return { ...state, ...result };
        }
        case MOVE_LEFT: {
            board.move('left');
            const result = board.toResult();
            return { ...state, ...result };
        }
        case MOVE_RIGHT: {
            board.move('right');
            const result = board.toResult();
            return { ...state, ...result };
        }
        case RESET: {
            board.restart();
            const result = board.toResult();
            return { ...state, ...result };
        }

        default:
            return state
    }
}