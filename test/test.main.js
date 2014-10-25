'use strict';

process.env.NODE_ENV = 'test';

var should = require('should');
var child = require('child_process');
var Publico = require('../main');

var p = new Publico('sender@email.com', {
  db: './test/db',
  frequency: 1
});

describe('publico', function () {
  after(function () {
    child.exec('rm -rf ./test/db');
  });

  describe('.addChat', function () {
    it('should add a new chat', function (done) {
      p.addChat('test message', false, function (err, c) {
        console.log('chat message: ', c);
        should.exist(c);
        c.message.should.eql('test message');

        p.getChats(false, false, function (err, c) {
          c.chats.length.should.equal(1);
          done();
        });
      });
    });

    it('should add a new chat that is destroyed after 1 second from retrieval', function (done) {
      p.addChat('test message with ttl', { ttl: 100 }, function (err, c) {
        console.log('test message with ttl ', c)
        setTimeout(function () {
          p.getChat(c.key, function (err, c1) {
            should.not.exist(c1);
            done();
          });
        }, 1500);
      });
    });
  });
});
