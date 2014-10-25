# meatspace-publico

Chat using LevelDB - the public edition. Currently under development.

## Installation

    > npm install

## Usage

    var publico = new Publico('you@email.com');

### Add a chat message

    publico.addChat('hola!', { ttl: 10000, media: 'http://someimage.jpg', fingerprint: '' }, function (err, c) {
      if (!err) {
        console.log(c);
      }
    });

If you do not set a ttl (e.g. passing {} or { ttl: false }), it will fall back to 10 seconds.

If you want to also store a some url or base64 string, pass it under media - otherwise, you can leave this out.

If you want to add a fingerprint to the message, add it in the options.

Once the chat has been created, the TTL will start.

### Get all chats

    publico.getChats(<reverse>, <key>, function (err, c) {
      if (!err) {
        console.log(c);
      }
    });

`reverse` is an optional boolean to reverse the chat history from latest -> earliest. Defaults at earliest -> latest.

`key` is a the point in which you want to grab data from - set to false if you want everything.

## Tests

    > make test
