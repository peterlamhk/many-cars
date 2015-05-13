(function() {
    var viewer = window.viewer = {};

    viewer.sessionId = null;
    viewer.latestPlayerList = [];
    var socket = null;
    viewer.init = function() {
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

    viewer.initRmChangeListener = function(callbackRmChange) {
        // listen to room player change
        socket.removeListener('roomUpdate');
        socket.on('roomUpdate', function(data) {
            viewer.latestPlayerList = data;
            callbackRmChange(data);
        });
    }

    viewer.initPlayerMoveListener = function(callbackPlayerChange) {
        // listen to players' actions
        socket.removeListener('playerMove');
        socket.on('playerMove', function(data) {
            callbackPlayerChange(data.player, data.move);
        });
    }

    viewer.createRoom = function(callback) {
        socket.emit('create', function(data) {
            if( data.success ) {
                $("button.btn-newroom").prop("disabled", true);

                viewer.sessionId = data.roomId;
                callback(viewer.sessionId);
            } else {
                console.log(data.reason);
            }
        });
    }

    viewer.updateMobileDisplay = function(data) {
        socket.emit('mobileDisplay', data);
    }

    viewer.updateMobileDisplayTrack = function(data) {
        socket.emit('mobileDisplayTrack', data);
    }
})();
