(function () {
    var Commands = {
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
    };

    var Editor = (function () {
        var NORMAL_MODE = 0,
            INSERT_MODE = 1;

        var Editor = {
            mode: NORMAL_MODE,
            modeStringTable: (function () {
                var _ = {};
                _[NORMAL_MODE] = "NORMAL";
                _[INSERT_MODE] = "INSERT";
                return _;
            })(),

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
            getModeString: function () {
                return this.modeStringTable[this.mode] || "(unknown)";
            },

            keyTable: {},
            defaultKeyTable: {},
        };
        Editor.keyTable[NORMAL_MODE] = {
            'j': Commands.moveDown,
            'k': Commands.moveUp,
            'h': Commands.moveLeft,
            'l': Commands.moveRight,
        };
        Editor.defaultKeyTable[NORMAL_MODE] =
            function (info) { /* ignore */ };

        return Editor;
    })();


    function getKeyChar(event) {
        if (!event.keyCode)
            return null;
        var keyChar = String.fromCharCode(event.keyCode);
        keyChar = event.shiftKey ? keyChar.toUpperCase() : keyChar.toLowerCase();
        return keyChar;
    }
    function dispatchKey(event) {
        event = event || window.event;
        var char = getKeyChar(event);
        if (typeof(char) !== typeof("")) {
            console.log("error: invalid key char.");
            return;
        }
        console.log("input: " + uneval(char));
        Editor.dispatchKey(char, event);
    }
    function onLoad() {
        if (!Prototype.Browser.Gecko) {
            alert("your browser is not supported yet!");
            return;
        }
        console.log("loading...");
        Event.observe(window, 'keydown', dispatchKey);
        $('mode').innerHTML = Editor.getModeString();
    }
    Event.observe(window, 'load', onLoad);
})();
