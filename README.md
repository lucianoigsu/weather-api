# weather-api

## Test

Para levantar el servidor:

$ docker run --rm -it -p 3100:3100 -v `pwd`:/app node:carbon /bin/bash
$ cd /app
$ npm install
$ node server.js