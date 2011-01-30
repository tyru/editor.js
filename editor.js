(function () {
    var NORMAL_MODE = 0,
        INSERT_MODE = 1;

    var Commands, Editor, UI;


    Commands = {
        /* NORMAL_MODE */
        insertLeft: function (info) {
            Editor.setMode(INSERT_MODE);
        },
        insertLeftMost: function (info) {
            Editor.setMode(INSERT_MODE);
            Commands.moveLeftMost();
        },
        insertRight: function (info) {
            Editor.setMode(INSERT_MODE);
            Commands.moveRight();
        },
        insertRightMost: function (info) {
            Editor.setMode(INSERT_MODE);
            Commands.moveRightMost();
        },

        moveDown: function (info) {
            Editor.setLineNum(Editor.getLineNum() + 1);
        },
        moveUp: function (info) {
            Editor.setLineNum(Editor.getLineNum() - 1);
        },
        moveLeft: function (info) {
            Editor.setColumn(Editor.getColumn() - 1);
        },
        moveRight: function (info) {
            Editor.setColumn(Editor.getColumn() + 1);
        },
        moveLeftMost: function (info) {
            Editor.setColumn(1);
        },
        moveRightMost: function (info) {
            Editor.setColumn(Editor.getMaxColumn());
        },

        /* INSERT_MODE */
        escapeToNormal: function (info) {
            Editor.setMode(NORMAL_MODE);
            Editor.setColumn(Editor.getColumn() - 1);
        },
        selfInsert: function (info) {
            /* TODO: Gap Buffer */
            var line = Editor.getCurrentLine();
            var col = Editor.getColumn();
            console.log("inserting '" + info.char + "' at (" + Editor.getColumn() + ", " + Editor.getLineNum() + ")");
            console.log(uneval([line.substr(0, col - 1), info.char, line.substr(col - 1)]));
            line = line.substr(0, col - 1) + info.char + line.substr(col - 1);
            Editor.setCurrentLine(line);

            Editor.setColumn(col + 1); // advance column
        },
    };

    Editor = {
        mode: NORMAL_MODE,
        col: 1,
        lnum: 1,
        keyTable: (function () {
            var _ = {};
            _[NORMAL_MODE] = {
                'i': Commands.insertLeft,
                'I': Commands.insertLeftMost,
                'a': Commands.insertRight,
                'A': Commands.insertRightMost,

                'j': Commands.moveDown,
                'k': Commands.moveUp,
                'h': Commands.moveLeft,
                'l': Commands.moveRight,
                '0': Commands.moveLeftMost,
                '$': Commands.moveRightMost,
            };
            _[INSERT_MODE] = {
                "\x1B" /* ESC */ : Commands.escapeToNormal,
            };
            return _;
        })(),
        defaultKeyTable: (function () {
            var _ = {};
            _[NORMAL_MODE] = function (info) { /* ignore */ };
            _[INSERT_MODE] = Commands.selfInsert;
            return _;
        })(),


        getAllLines: function () {
            return $F('buffer').split("\n");
        },
        getColumn: function () {
            return this.col;
        },
        getMaxColumn: function () {
            return this.getCurrentLine().length + 1;
        },
        setColumn: function (col) {
            if (1 <= col && col < this.getMaxColumn()) {
                this.col = col;
            }
            else {
                console.log("invalid column number: " + col);
            }
        },
        getLineNum: function () {
            return this.lnum;
        },
        getMaxLineNum: function () {
            return this.getAllLines().length;
        },
        setLineNum: function (lnum) {
            if (1 <= lnum && lnum < this.getMaxLineNum()) {
                this.lnum = lnum;
            }
            else {
                console.log("invalid line number: " + lnum);
            }
        },
        getCurrentLine: function () {
            return this.getAllLines()[this.lnum - 1];
        },
        setCurrentLine: function (line) {
            var lines = this.getAllLines();
            lines[this.lnum - 1] = line;
            $('buffer').value = lines.join("\n");
        },
        getMode: function () {
            return this.mode;
        },
        dispatchKey: function (char, event) {
            var info = {
                'char': char,
                'event': event,
                'mode': this.mode,
            };
            if (this.keyTable[this.mode][char])
                this.keyTable[this.mode][char](info);
            else
                this.defaultKeyTable[this.mode](info);
        },
        setMode: function (mode) {
            this.mode = mode;
            UI.setModeString(this.mode);
        },
    };


    UI = {
        modeStringTable: (function () {
            var _ = {};
            _[NORMAL_MODE] = "NORMAL";
            _[INSERT_MODE] = "INSERT";
            return _;
        })(),

        getModeString: function (mode) {
            return this.modeStringTable[mode] || "(unknown)";
        },
        setModeString: function (mode) {
            $('mode').innerHTML = this.getModeString(mode);
        },
        getKeyChar: function (event) {
            if (!event.keyCode)
                return null;
            var keyChar = String.fromCharCode(event.keyCode);
            keyChar = event.shiftKey ? keyChar.toUpperCase() : keyChar.toLowerCase();
            return keyChar;
        },
        dispatchKey: function (event) {
            event = event || window.event;
            var char = this.getKeyChar(event);
            if (typeof(char) !== typeof("")) {
                console.log("error: invalid key char.");
                return;
            }
            console.log("input: " + uneval(char));
            Editor.dispatchKey(char, event);
        },
        onLoad: function () {
            if (!Prototype.Browser.Gecko) {
                alert("your browser is not supported yet!");
                return;
            }
            console.log("loading...");
            Event.observe(window, 'keydown', this.dispatchKey.bind(this));
            this.setModeString(Editor.getMode());
        },
    };


    Event.observe(window, 'load', UI.onLoad.bind(UI));
})();
