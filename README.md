# Y8 Instant io Game

This is a boilerplate combining several top open source tools
 to give you an easy starting point to making an io multipler game. It uses
 Node.js with webpack, ES6, and classes. ExpressJS serves webpages and Socket.io
 handles the communication. Phaser 3, provides a 2D engine for graphics.

![screenshot](https://raw.githubusercontent.com/Y8Games/Y8-Instant-io-Game/master/screenshot2.png)

- If you are new to coding, better to learn JS first https://developer.mozilla.org/en-US/docs/Learn/JavaScript

## Install
- Download and install Node.js and optionally MongoDb. https://nodejs.org/en/download/
- Navigate to the project root where package.json is and run `npm install` in a
 terminal, command prompt or preferably Git Bash.

## Development
- `npm start`
- Open `http://localhost:8080` in one or more browser tabs
- Visit https://labs.phaser.io/ for game ideas
- Client side code (everything in the src folder) is auto loaded. To restart the server, push `Ctrl + C`

## Production Build
- Installing, 'npm i webpack -g' and 'npm i webpack-cli -g'
- `npm run build` (requires unix like terminal)

## Deployment
- Start server for production `pm2 start server.js`
- Suggest to make an autostart in pm2

Provided by <a href="https://y8.com">Y8 Games</a>. See other
 <a href="https://www.y8.com/tags/io_games">io games</a>. Also see the
 upload page to <a href="https://static.y8.com/upload">submit games</a>.
