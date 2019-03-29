# Y8 Instant io Game

This super game making boilerplate combines several top open source tools
 to give you an easy starting point to making an io multipler game. Inside Y8
 Instant io Game, is a Node.js server with webpack, es6, and classes. Socket.io
 is where the multiplayer communication happens, it's super easy. For the visuals
 Phaser 3, one of the best 2D html5 engines on the market, but it's free. Beautiful,
 powerful, and open source. If you like this, remember to give a link to
 <a href="https://y8.com">Y8 Games</a>

## Install
- Download and install Node.js and maybe MongoDb. https://nodejs.org/en/download/
- Navigate to the project root where package.json lives and run `npm install` in a terminal

## Development
- `npm start`
- Open `http://localhost:8080`
- Visit https://labs.phaser.io/ for game ideas

## Production Build
- Installing, 'npm i webpack -g' and 'npm i webpack-cli -g'
- `npm run build` (requires unix like terminal)

## Deployment
- Start server for production `pm2 start server.js`
- Suggest to make an autostart in pm2

