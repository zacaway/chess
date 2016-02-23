(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.model = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.createGame = createGame;
    var King = exports.King = Symbol('King');
    var Queen = exports.Queen = Symbol('Queen');
    var Rook = exports.Rook = Symbol('Rook');
    var Bishop = exports.Bishop = Symbol('Bishop');
    var Knight = exports.Knight = Symbol('Knight');
    var Pawn = exports.Pawn = Symbol('Pawn');

    var White = exports.White = Symbol('White');
    var Black = exports.Black = Symbol('Black');

    var Pieces = exports.Pieces = [King, Queen, Rook, Bishop, Knight, Pawn];
    var Sides = exports.Sides = [White, Black];
    var Ranks = exports.Ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    var Files = exports.Files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    function createGame(onChange) {
        var board = function () {
            var K = King,
                Q = Queen,
                R = Rook,
                B = Bishop,
                N = Knight,
                p = Pawn;
            var w = function w(piece) {
                return { side: White, piece: piece };
            };
            var b = function b(piece) {
                return { side: Black, piece: piece };
            };
            return [[w(R), w(N), w(B), w(Q), w(K), w(B), w(N), w(R)], [w(p), w(p), w(p), w(p), w(p), w(p), w(p), w(p)], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [null, null, null, null, null, null, null, null], [b(p), b(p), b(p), b(p), b(p), b(p), b(p), b(p)], [b(R), b(N), b(B), b(Q), b(K), b(B), b(N), b(R)]];
        }();
        var turn = White;

        function squareIdToIndex(squareId) {
            return [Ranks.indexOf(squareId[1] | 0), Files.indexOf(squareId[0])];
        }

        function getAt(squareId) {
            var indicies = squareIdToIndex(squareId);
            return board[indicies[0]][indicies[1]];
        }

        function setAt(squareId, piece) {
            var indicies = squareIdToIndex(squareId);
            board[indicies[0]][indicies[1]] = piece;
        }

        function isValidMove(srcId, destId) {
            var src = getAt(srcId);
            var dest = getAt(destId);

            if (!src) return false;
            if (dest && src.side === dest.side) return false;

            if (!dest) return true;
            if (dest && src.side !== dest.side) return true;

            return false;
        }

        function move(srcId, destId) {
            if (!isValidMove(srcId, destId)) throw new Error('Invalid move');
            setAt(destId, getAt(srcId));
            setAt(srcId, null);
            turn = turn === White ? Black : White;
            onChange && onChange();
        }

        return {
            getAt: getAt,
            isValidMove: isValidMove,
            move: move
        };
    }
});
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'model'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('model'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.model);
        global.view = mod.exports;
    }
})(this, function (exports, _model) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.createView = createView;
    exports.initialize = initialize;
    function createView(_document, game) {
        var activeSquareId = null;

        function onDragStart(event) {
            event.target.classList.add('dragging');
            activeSquareId = event.target.dataset.squareId;
        }

        function onDragOver(event) {
            var srcId = activeSquareId;
            var square = event.currentTarget;
            var destId = square.id;
            if (destId && game.isValidMove(srcId, destId)) {
                event.dataTransfer.dropEffect = 'move';
                event.preventDefault();
            }
        }

        function onDragEnter(event) {
            var srcId = activeSquareId;
            var square = event.currentTarget;
            var destId = square.id;
            if (destId && game.isValidMove(srcId, destId)) {
                square.classList.add('dropzone');
                event.preventDefault();
            }
        }

        function onDragLeave(event) {
            var square = event.currentTarget;
            square.classList.remove('dropzone');
        }

        function onDrop(event) {
            var srcId = activeSquareId;
            var square = event.currentTarget;
            var destId = square.id;
            square.classList.remove('dropzone');
            if (destId && game.isValidMove(srcId, destId)) {
                game.move(srcId, destId);
                event.preventDefault();
            }
        }

        function onDragEnd(event) {
            event.target.classList.remove('dragging');
            activeSquareId = null;
        }

        function getGlyphForPiece(piece) {
            if (!piece) return '';

            // https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode
            var pieceOffset = _model.Pieces.indexOf(piece.piece);
            var sideOffset = _model.Sides.indexOf(piece.side) * 6;
            var base = 9812;

            return String.fromCharCode(base + sideOffset + pieceOffset);
        }

        function render() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _model.Files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var file = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _model.Ranks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var rank = _step2.value;

                            var id = file + rank;
                            var square = _document.getElementById(id);
                            var glyph = getGlyphForPiece(game.getAt(id));
                            var piece = _document.createElement('span');

                            piece.innerHTML = glyph;
                            piece.draggable = true;
                            piece.dataset.squareId = id;
                            piece.ondragstart = onDragStart;
                            piece.ondragend = onDragEnd;

                            square.innerHTML = '';
                            square.appendChild(piece);
                            square.ondragover = onDragOver;
                            square.ondragenter = onDragEnter;
                            square.ondragleave = onDragLeave;
                            square.ondrop = onDrop;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        return {
            render: render
        };
    }

    function initialize() {
        var onChange = function onChange() {
            return view.render();
        };
        var game = (0, _model.createGame)(onChange);
        var view = createView(document, game);

        view.render();
        window.game = game;
        window.view = view;
    }
});
//# sourceMappingURL=all.js.map
