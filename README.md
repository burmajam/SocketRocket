# SocketRocket.js

> A wrapper for the websockets API making it more user-friendly and adding some extra features.

Extra features you get with SocketRocket:

- Configure a websocket BEFORE you open it.
- Manually open a websocket
- Bind multiple functions to each websocket event
- Remove functions bound to websocket events
- **Close and then re-open a websocket without losing bound events**

## How to use it

Whereas the XMLHttpRequest object has a `.open` method, a WebSocket object opens itself immediately upon being declared.  This is
a little strange because, depending on how your websockets app is written,  you end up with the possibility of receiving messages 
before you attach event handlers.  Maybe you care about that, maybe you don't.  Personally, I'm just a fan of greater control in general
so I've created a workaround for this little issue in SocketRocket.  Here's how it works:

### Creating a connection

SocketRocket attaches a namespace to the global object by default.  That namespace is called 'SocketRocket' or 'SR' for short.  To use it, you'll start by creating a connection.

```javascript

var sock = SR.create('ws://example.com/socketURL');

```

What's nice is that `SR.create` only prepares a connection.  It doesn't open one.  This allows you attach event handlers to your
websocket before you open it.

### Attaching event handlers

`SR.create` makes a new SocketRocket object with a few cool methods.  To attach functions to websocket events, you'll use the `.addTo`
method.

```javascript

// Bind a function to websocket.onopen
sock.addTo('open', function (evt) { console.log(evt) });

// Bind a function to websocket.onmessage
sock.addTo('message', function (evt) { console.log(evt) });

// Bind ANOTHER function to websoket.onmessage
sock.addTo('message', function (evt) { return 'I ran too!' });

// Bind a function to websocket.onerror
sock.addTo('error', function (evt) { console.log(evt) });

// Bind a function the websocket.onclose
sock.addTo('close', function (evt) { console.log(evt) });

```

Notice in the above example that we bound 2 functions to the `websocket.onmessage` event.  Using SocketRocket, you can bind as many
functions as you want to each event.  When the event occurs, each function bound to that event will be invoked with the event object as
an argument.

### Opening the connection

Now that you have configured your websocket you'll probably want to open it.  Just do it like this:

```javascript

sock.open();

```

`.open` establishes a connection with the websocket in question.  Assuming the connection actually opens, any functions you
have bound to the 'open' event will run.  At this point you have an open, running websocket connection.  If at any
point you would like to add another function to one of your websocket events, you can use `.addTo` just like before.  You
do NOT have to bind all of your events before you open a connection (although it might be smart to do so).

Of course, any time you want to send something down the pipe, you can just run...

```javascript

sock.send();

```

And it works like you'd probably expect.  However, you will have to open the connection before you can send anything across it.

### Closing the connection

One strange point about the standard websockets API is that once you close a connection it's gone.  You can not re-open the
connection and, as such, all of your event bindings have disappeared.  SocketRocket gives you more control here as well.
To close a connection, just do it like this:

```javascript

sock.close();

```

In the above example, we have closed the connection to the server but have not lost our event bindings.  In fact, we can
re-open the connection like this...

```javascript

sock.open();

```

...and all of our previously bound events will be re-applied to the connection.

### Removing event handlers

At any point you have the option of clearing out the functions attached to one of your websocket events.  To unbind all
functions attached to the 'onmessage' event, for example, you could do this:

```javascript

sock.clear('message');

```

The above snippet will unbind all functions from the 'onmessage' event on this particular websocket connection.

### Viewing the state of your event handlers

At any point you have the option of viewing all the functions you have bound to your connection events and also the nature
of your actual WebSocket object by calling `.getState`.

```javascript

sock.getState();

/*
Returns something like this:
{
	"open"    : [], // array of functions
	"close"   : [], // array of functions
	"error"   : [], // array of functions
	"message" : [], // array of functions
	"socket"  : {}  // the WebSocket Object
}
*/

```

### Smashing a connection to bits

Sometimes you might want to completely obliterate a connection.  By calling...

```javascript

sock.destroy();

```

...you will close the connection and unbind all functions currently attached to every event in the connection.

## Working on a higher level

We have already discussed `SocketRocket.create` which prepares a new websocket connection.  However, the SocketRocket library
provides two other methods for working with your connections on a higher level.

### Viewing the overall state

You already know that each individual connection has a `.getState` method.  But it turns out that there is also a general
`.getState` method that when called like this...

```javascript

SR.getState();

```

...will return an object showing all of your available websocket connections and all functions subscribed to each of their events.

### Killing everything

In case you are feeling paranoid about having accidentally left a function bound to a connection or accidentally left a connection
open, you have the option of calling `SocketRocket.clear` like so:

```javascript

SR.clear();

```

The above snippet will close all websocket connections and unbind all event handlers from each of their events.