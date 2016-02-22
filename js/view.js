"use strict"

function createView(_document, game) {
    let activeSquareId = null

    function onDragStart(event) {
        event.target.classList.add('dragging')
        activeSquareId = event.target.dataset.squareId
    }

    function onDragOver(event) {
        const srcId = activeSquareId
        const square = event.currentTarget
        const destId = square.id
        if (destId && game.isValidMove(srcId, destId)) {
            event.dataTransfer.dropEffect = 'move'
            event.preventDefault()
        }
    }

    function onDragEnter(event) {
        const srcId = activeSquareId
        const square = event.currentTarget
        const destId = square.id
        if (destId && game.isValidMove(srcId, destId)) {
            square.classList.add('dropzone')
            event.preventDefault()
        }
    }

    function onDragLeave(event) {
        const square = event.currentTarget
        square.classList.remove('dropzone')
    }

    function onDrop(event) {
        const srcId = activeSquareId
        const square = event.currentTarget
        const destId = square.id
        square.classList.remove('dropzone')
        if (destId && game.isValidMove(srcId, destId)) {
            game.move(srcId, destId)
            event.preventDefault()
        }
    }

    function onDragEnd(event) {
        event.target.classList.remove('dragging')
        activeSquareId = null
    }

    function getGlyphForPiece(piece) {
        if (!piece) return '';

        // https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode
        const pieceOffset = Pieces.indexOf(piece.piece)
        const sideOffset = Sides.indexOf(piece.side) * 6
        const base = 9812

        return String.fromCharCode(base + sideOffset + pieceOffset)
    }

    function render() {
        for (let file of Files) {
            for (let rank of Ranks) {
                const id = file + rank
                const square = _document.getElementById(id)
                const glyph = getGlyphForPiece(game.getAt(id))
                const piece = _document.createElement('span')

                piece.innerHTML = glyph
                piece.draggable = true
                piece.dataset.squareId = id
                piece.ondragstart = onDragStart
                piece.ondragend = onDragEnd

                square.innerHTML = ''
                square.appendChild(piece)
                square.ondragover = onDragOver
                square.ondragenter = onDragEnter
                square.ondragleave = onDragLeave
                square.ondrop = onDrop
            }
        }
    }

    return {
        render
    }
}

function initialize() {
    var onChange = () => view.render()
    var game = createGame(onChange)
    var view = createView(document, game)

    view.render()
    window.game = game
    window.view = view
}
