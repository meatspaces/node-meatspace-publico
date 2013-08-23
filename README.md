# meatspace-publico

Chat using LevelDB - the public edition. Currently under development.

## Installation

    > npm install

## Usage

    var publico = new Publico('you@email.com');

### Add a chat message

    publico.addChat('hola!', { ttl: 10000, media: 'http://someimage.jpg' }, function (err, c) {
      if (!err) {
        console.log(c);
      }
    });

If you do not set a ttl (e.g. passing {} or { ttl: false }), it will fall back to 10 seconds.
If you want to also store a some url or base64 string, pass it under media - otherwise, you can leave this out.

Once the chat has been created, the TTL will start.

### Get all chats

    publico.getChats(<reverse>, function (err, c) {
      if (!err) {
        console.log(c);
      }
    });

`reverse` is an optional boolean to reverse the chat history from latest -> earliest. Defaults at earliest -> latest.

## Tests

    > make test
