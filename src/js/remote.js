(function() {
    var remote = window.remote = {};

    remote.sessionId = null;
    remote.playerId = null;
    var socket = null;
    remote.init = function() {
        // initialize socket.io and events
        initSocketIO();
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

    remote.initMobileDisplayChange = function(callbackDisplayChange) {
        socket.on('updateCars', function(data) {
            callbackDisplayChange(data);
        });
    }

    remote.registerRoom = function(roomId, callback) {
        socket.emit('register', roomId, function(data) {
            if( data.success ) {
                $("button.btn-newroom").prop("disabled", true);

                sessionId = data.roomId;
                playerId = data.playerId;

                callback(playerId);
            } else {
                callback(data.reason);
            }
        });
    }

    remote.emitMove = function(controls) {
        socket.emit('move', controls);
    }
})();