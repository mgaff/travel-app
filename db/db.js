var mongoose     = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
var Schema       = mongoose.Schema;
var bcrypt       = require('bcrypt-nodejs');

// sets db location to Heroku Mongolab uri or local host
var dbUri;

if (process.env.MONGOLAB_URI) {
  dbUri = process.env.MONGOLAB_URI;
} else if (process.env.NODE_ENV === 'test') {
  dbUri = 'mongodb://localhost/tripapptest';
} else {
  dbUri = 'mongodb://localhost/tripapp';
}

mongoose.connect(dbUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// db connection and error logging
db.once('open', function() {
  console.log('Connection established with MongoDB at: ' + dbUri);
});
db.on('error', console.error.bind(console, 'Connection error: unable to establish connection with MongoDB at: ' + dbUri));
db.on('diconnected', mongoose.connect);

var userSchema = new Schema ({
  username: {
    type: String,
    required: true
  },

  password: {
    type: String
  },

  oauth: {
    type: Boolean
  },

  groupId: [{
    type: Schema.ObjectId,
    ref: 'Group'
  }],

  favorites: [{
    venue: {
      type: Schema.ObjectId,
      ref: 'Venue'
    },
    rating: Number
  }]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

db.userSchema = userSchema;

var groupSchema = new Schema ({
  title: {
    type: String,
    required: true,
    unique: false,
    validate: [
      function (title) {
        return title.trim().length > 0;
      },
      'Group title too short'
    ]
  },
  // TODO Compare this against destinations in DB
  destination: {
    type: String,
    required: true,
    unique: false,
    validate: [
      function (title) {
        return title.trim().length > 0;
      },
      'Group needs a destination'
    ]
  },
  host: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: Schema.ObjectId,
    ref: 'Venue'
  }]
});

db.groupSchema = groupSchema;

var venueSchema = new Schema ({
  lookUpId: Number,
  venue_type_id: Number,
  name: String,
  tripexpert_score: Number,
  rank_in_destination: Number,
  address: String,
  telephone: String,
  website: String,
  index_photo: String,
  photos: Array,
  amenities: Array,
  userRating: {type: Number, default: 5}
});


db.venueSchema = venueSchema;

var ratingSchema = new Schema ({
  venueId: {
    type: Schema.ObjectId,
    ref: 'Venue'
  },
  groupId: {
    type: Schema.ObjectId,
    ref: 'Group'
  },
  ratings: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    rating: Number
  }]
});

db.ratingSchema = ratingSchema;

var destSchema = new Schema ({
  perm: String,
  destId: Number
})

destSchema.plugin(findOrCreate);

db.destSchema = destSchema;


module.exports = db;
