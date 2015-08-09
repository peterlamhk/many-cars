(function() {
    var remote = window.remote = {};

    remote.sessionId = null;
    remote.playerId = null;
    remote.motion = null;
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
        var port = window.location.port || '80';

        socket = io('ws://' + host + ':' + port, {
            'reconnectionAttempts': 3
        });

        var connectionFailed = function() {
            console.log("Failed to connect websocket server.");
        }
        socket.on('connect_failed', connectionFailed);
        socket.on('reconnect_failed', connectionFailed);
    }

    remote.initTrackChange = function(callbackTrackChange) {
        socket.removeListener('trackChange');
        socket.on('trackChange', function(trackId) {
            callbackTrackChange(trackId, remote.playerId);
        });
    }

    remote.initMobileDisplayChange = function(callbackDisplayChange) {
        socket.removeListener('updateCars');
        socket.on('updateCars', function(data) {
            callbackDisplayChange(data);
        });
    }

    remote.registerRoom = function(roomId, callback) {
        socket.emit('register', roomId, function(data) {
            if( data.success ) {
                $("button.btn-newroom").prop("disabled", true);

                remote.sessionId = data.roomId;
                remote.playerId = data.playerId;

                callback(remote.playerId);
            } else {
                callback(data.reason);
            }
        });
    }

    remote.emitMove = function(controls) {
        socket.emit('move', controls);
    }
})();
