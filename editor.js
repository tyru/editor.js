(function () {
    function getKeyChar(e) {
        var keyChar = String.fromCharCode(e.keyCode);
        keyChar = e.shiftKey ? keyChar.toUpperCase() : keyChar.toLowerCase();
        return keyChar;
    }
    function dispatchKey(e) {
        e = e || window.event;
        var char = getKeyChar(e);
        console.log("input: " + char);
    }
    function onLoad() {
        if (!Prototype.Browser.Gecko) {
            alert("your browser is not supported yet!");
            return;
        }
        console.log("loading...");
        Event.observe('editor', 'keydown', dispatchKey);
    }
    Event.observe(window, 'load', onLoad);
})();
