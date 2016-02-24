"use strict"

export const King   = Symbol('King')
export const Queen  = Symbol('Queen')
export const Rook   = Symbol('Rook')
export const Bishop = Symbol('Bishop')
export const Knight = Symbol('Knight')
export const Pawn   = Symbol('Pawn')

export const White = Symbol('White')
export const Black = Symbol('Black')

export const Pieces = [King, Queen, Rook, Bishop, Knight, Pawn]
export const Sides = [White, Black]
export const Ranks = [1, 2, 3, 4, 5, 6, 7, 8]
export const Files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export function createGame(onChange) {
    let board = (function() {
        const K = King, Q = Queen, R = Rook, B = Bishop, N = Knight, p = Pawn
        const w = (piece) => ({ side: White, piece })
        const b = (piece) => ({ side: Black, piece })
        return [
            [w(R), w(N), w(B), w(Q), w(K), w(B), w(N), w(R)],
            [w(p), w(p), w(p), w(p), w(p), w(p), w(p), w(p)],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [b(p), b(p), b(p), b(p), b(p), b(p), b(p), b(p)],
            [b(R), b(N), b(B), b(Q), b(K), b(B), b(N), b(R)],
        ]
    })()
    let turn = White

    function squareIdToIndex(squareId) {
        return [
            Ranks.indexOf(squareId[1] | 0),
            Files.indexOf(squareId[0])
        ]
    }

    function getAt(squareId) {
        const indicies = squareIdToIndex(squareId)
        return board[indicies[0]][indicies[1]]
    }

    function setAt(squareId, piece) {
        const indicies = squareIdToIndex(squareId)
        board[indicies[0]][indicies[1]] = piece
    }

    function isValidMove(srcId, destId) {
        const src = getAt(srcId)
        const dest = getAt(destId)

        if (!src) return false;
        if (src.side !== turn) return false;
        if (dest && src.side === dest.side) return false;

        if (!dest) return true;
        if (dest && src.side !== dest.side) return true;

        return false
    }

    function move(srcId, destId) {
        if (!isValidMove(srcId, destId)) throw new Error('Invalid move');
        setAt(destId, getAt(srcId))
        setAt(srcId, null)
        turn = turn === White ? Black : White
        onChange && onChange()
    }

    return {
        getAt,
        isValidMove,
        move
    }
}
