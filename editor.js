(function () {
    var NORMAL_MODE = 0,
        INSERT_MODE = 1;

    var Commands, Editor, UI;


    Commands = {
        insertLeft: function (info) {
            Editor.setMode(INSERT_MODE);
        },
        insertLeftMost: function (info) {
            Editor.setMode(INSERT_MODE);
            this.moveLeftMost();
        },
        insertRight: function (info) {
            Editor.setMode(INSERT_MODE);
            this.moveRight();
        },
        insertRightMost: function (info) {
            Editor.setMode(INSERT_MODE);
            this.moveRightMost();
        },

        moveDown: function (info) {
            console.log("down");
        },
        moveUp: function (info) {
            console.log("up");
        },
        moveLeft: function (info) {
            console.log("left");
        },
        moveRight: function (info) {
            console.log("right");
        },
        moveLeftMost: function (info) {
            console.log("left most");
        },
        moveRightMost: function (info) {
            console.log("right most");
        },

        escapeToNormal: function (info) {
            Editor.setMode(NORMAL_MODE);
        },
    };

    Editor = {
        mode: NORMAL_MODE,
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
            _[NORMAL_MODE] =
                function (info) { /* ignore */ };
            return _;
        })(),


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
