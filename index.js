'use strict';
const http = require('http');
const jade = require('jade');
const auth = require('http-auth');
const basic = auth.basic(
  { realm: 'Enter username and password.' },
  (username, password, callback) => {
    callback(username === 'guest' && password === 'xaXZJQmE');
  });

const server = http.createServer(basic, (req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested');

  // ログアウト
  if (req.url === '/logout') {
    res.writeHead(401, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('ログアウトしました');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: '焼肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(jade.renderFile('./form.jade', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }))
      }
      res.end();
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body);
        const decoded = decodeURIComponent(body);
        console.info('[' + now + '] 投稿: ' + decoded);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          decoded + 'が投稿されました</h1></body></html>')
        res.end();
      });
      break;
    default:
      break;
  }
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
});
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('Listening on ' + port);
});