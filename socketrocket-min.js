/*
Name: SocketRocket.js
Author: John Newman
License: MIT
*/
(function(a){"use strict";var b,c={};function h(d,e,f){var i,o=c[d][e],l=o.length;for(i=0;i<l;i+=1){o[i](f);}}function Socket(d){var g=this;c[d]={"socket":g,"open":[],"close":[],"message":[],"error":[]};g.uri=d;g.getState=function(){return c[d];};g.open=function(){g.socket = new a.WebSocket(d);g.socket.onopen=function(e){h(d,'open',e);};g.socket.onclose=function(e){h(d,'close',e);};g.socket.onmessage=function(e){h(d,'message',e);};g.socket.onerror=function(e){h(d,'error',e);};};g.addTo=function(e,f){c[d][e].push(f);};g.send=function(x){return (g.socket)?g.socket.send(x):false;};g.close=function(){return (g.socket)?g.socket.close.apply(null, arguments):false;};g.clear=function(e){c[d][e]=[];};g.destroy=function(){g.addTo('close',function(){delete c[d];});g.close.apply(null,arguments);};return g;}b={"create":function(d){return new Socket(d);},"getState":function(){return c;},"clear":function(){var i,j=function(i){c[i].socket.addTo('close',function(){delete c[i];});};for(i in c){if(Object.prototype.hasOwnProperty.call(c,i)){j(i);c[i].socket.close.apply(arguments);}}}};a.SR=a.SocketRocket=b;}(this));