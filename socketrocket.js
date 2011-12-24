/*
Name: SocketRocket.js
Date: 12/23/2011
Author: John Newman
License: MIT
Version: 1.0
Description: A wrapper for the websocket API.  Allows you a few extra features:
    - Congigure a websocket BEFORE you open it.
    - Manually open a websocket
    - Bind multiple functions to each websocket event
    - Close and then re-open a websocket without losing bound events
    - Manually remove functions bound to websocket events
*/

(function (context) {
    "use strict";

    var sr, connections = {};

    function dispatch(connection, event, arg) {
        var i, o = connections[connection][event], l = o.length;
        for (i = 0; i < l; i += 1) {
            o[i](arg);
        }
    }

    function Socket(uri) {
        var that = this;

        connections[uri] = {
            "socket" : that,
            "open" : [],
            "close" : [],
            "message" : [],
            "error" : []
        };

        that.uri = uri;

        that.getState = function () {
            return connections[uri];
        };

        that.open = function () {
            that.socket = new context.WebSocket(uri);
            that.socket.onopen = function (evt) {
                dispatch(uri, 'open', evt);
            };
            that.socket.onclose = function (evt) {
                dispatch(uri, 'close', evt);
            };
            that.socket.onmessage = function (evt) {
                dispatch(uri, 'message', evt);
            };
            that.socket.onerror = function (evt) {
                dispatch(uri, 'error', evt);
            };
        };

        that.addTo = function (ev, func) {
            connections[uri][ev].push(func);
        };

        that.send = function (x) {
            return (that.socket) ? that.socket.send(x) : false;
        };

        that.close = function () {
            return (that.socket) ? that.socket.close() : false;
        };

        that.clear = function (ev) {
            delete connections[uri][ev];
        };

        that.destroy = function () {
            that.addTo('close', function () {
                delete connections[uri];
            });
            that.close();
        };

        return that;
    }

    sr = {
        "create" : function (uri) {
            return new Socket(uri);
        },
        "getState" : function () {
            return connections;
        },
        "clear" : function () {
            var i, remove = function (i) {
                connections[i].socket.addTo('close', function () {
                    delete connections[i];
                });
            };
            for (i in connections) {
                if (Object.prototype.hasOwnProperty.call(connections, i)) {
                    remove(i);
                    connections[i].socket.close();
                }
            }
        }
    };

    context.SR = context.SocketRocket = sr;

}(this));