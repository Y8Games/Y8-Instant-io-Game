/*
* Optional MongoDB database if you need persistant data storage.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/y8-instant-io', { useNewUrlParser: true })
.catch(err => {
  console.error('MongoDb not found, no problem skipping'.red);
});

const playerSchema = new Schema({
  name: { type: String },
  email: { type: String }
})
Players = mongoose.model('Players', playerSchema);

module.exports = {
  Players
};

// Example useage
//var player = new db.Player({ name: 'whatever' });
//player.save();
