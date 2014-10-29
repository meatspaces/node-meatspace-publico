'use strict';

var level = require('level');
var ttl = require('level-ttl');
var uuid = require('uuid');
var Sublevel = require('level-sublevel');
var concat = require('concat-stream');

var Publico = function (user, options) {
  var self = this;

  var DEFAULT_TTL = 10000; // 10 seconds
  var CHAT_TTL_LONG = 259200000; // 3 days

  var setTime = function () {
    return Date.now();
  };

  if (!options) {
    options = {};
  }

  this.user = user;
  this.dbPath = options.db || './db';
  this.limit = options.limit || 30;
  this.db = Sublevel(level(this.dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  }));
  this.db = ttl(this.db, { checkFrequency: options.frequency || 10000 });

  var sendChat = function (key, chat, created, options, callback) {
    var ttl = DEFAULT_TTL;

    if (options.ttl) {
      ttl = parseInt(options.ttl, 10);

      if (isNaN(ttl)) {
        ttl = DEFAULT_TTL;
      }
    }

    callback(null, {
      message: chat,
      fingerprint: options.fingerprint || '',
      media: options.media || false,
      owner: options.owner || false,
      ttl: ttl,
      key: key,
      created: created
    });
  };

  this.getChat = function (key, callback) {
    self.db.get(key, function (err, chat) {
      if (err || !chat) {
        callback(new Error('Chat not found'));
      } else {
        callback(null, chat);
      }
    });
  };

  this.getChats = function (reverse, key, callback) {
    var rs = self.db.createReadStream({
      limit: self.limit,
      reverse: reverse,
      start: key || '\x00'
    });

    rs.pipe(concat(function (chats) {
      callback(null, {
        chats: chats
      });
    }));

    rs.on('error', function (err) {
      callback(err);
    });
  };

  this.addChat = function (chat, options, callback) {
    var ttl = DEFAULT_TTL;

    if (!options) {
      options = {};
    }

    if (options.ttl) {
      ttl = parseInt(options.ttl, 10);

      if (isNaN(ttl)) {
        ttl = DEFAULT_TTL;
      }
    }

    var created = setTime();
    var key = setTime() + '!' + uuid.v4();

    self.db.put(key, {
      fingerprint: options.fingerprint || '',
      message: chat,
      media: options.media || false,
      owner: options.owner || false,
      ttl: ttl,
      created: created
    }, { ttl: ttl }, function (err) {
      if (err) {
        callback(err);
      } else {
        sendChat(key, chat, created, options, callback);
      }
    });
  };
};

module.exports = Publico;
