(function() {
    var viewer = window.viewer = {};

    viewer.sessionId = null;
    var socket = null;
    viewer.init = function() {
        // initialize socket.io and events
        initSocketIO();
        initSocketListener();
        window.addEventListener('beforeunload', function() {
            socket.close();
        });
    }

    var initSocketIO = function() {
        var host = document.domain;
        var port = 3000;

        socket = io('ws://' + host + ':' + port, {
            'reconnectionAttempts': 3
        });

        var connectionFailed = function() {
            console.log("Failed to connect websocket server.");
        }
        socket.on('connect_failed', connectionFailed);
        socket.on('reconnect_failed', connectionFailed);
    }

    var initSocketListener = function(callbackRmChange, callbackPlayerChange) {
        // listen to room player change
        socket.on('roomUpdate', function(data) {
            console.log("room update " + JSON.stringify(data));
        });

        // listen to players' actions
        socket.on('playerMove', function(data) {
            console.log("player " + data.player + " update " + data.move);
        });
    }

    viewer.createRoom = function(callback) {
        socket.emit('create', function(data) {
            if( data.success ) {
                $("button.btn-newroom").prop("disabled", true);

                sessionId = data.roomId;
                callback(sessionId);
            } else {
                console.log(data.reason);
            }
        });
    }
})();
