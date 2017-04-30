var ObjectID = require('mongodb').ObjectID;

var databaseName = "Jeeves";
// Put the initial mock objects here.
var initialData = {
  // The "user" collection. Contains all of the users in our Facebook system.
  "users": {
    // This user has id "1".
    "1": {
      "_id": new ObjectID("000000000000000000000001"),
      "fullName": "Other user 1",
      "masterFolder": new ObjectID("000000000000000000000001")
    },
    "2": {
      "_id": new ObjectID("000000000000000000000002"),
      "fullName": "Other user 2",
      "masterFolder": new ObjectID("000000000000000000000002")
    },
    "3": {
      "_id": new ObjectID("000000000000000000000003"),
      "fullName": "Other user 3",
      "masterFolder": new ObjectID("000000000000000000000003")
    },
    // This is "you"!
    "4": {
      "_id": new ObjectID("000000000000000000000004"),
      "fullName": "This user",
      // ID of your masterfolder.
      "masterFolder": new ObjectID("000000000000000000000004")
    }
  },

  "contentItems": {
    "1": {
      "_id": new ObjectID("000000000000000000000001"),

      "type": "note",
      "contents": {
        // ID of the user that posted the status update.
        "author": new ObjectID("000000000000000000000004"),
        // 01/24/16 3:48PM EST, converted to Unix Time
        // (# of milliseconds since Jan 1 1970 UTC)
        // https://en.wikipedia.org/wiki/Unix_time
        "postDate": 1453668480000,
        "contents": "Ideas for a screenplay: ehhh!"
      }
    },
    "2": {
      "_id": new ObjectID("000000000000000000000002"),
      "type": "note",
      "contents": {
        "author": new ObjectID("000000000000000000000004"),
        "postDate": 1458231460117,
        "location": "LOCATION",
        "contents": "Gym stuff\nyay\ndouble yay"
      }
    }
  },

  "masterFolders": {
    "4": {
      "_id": new ObjectID("000000000000000000000004"),
      // Listing of FeedItems in the feed.
      "contents": [new ObjectID("000000000000000000000002"), new ObjectID("000000000000000000000001")]
    },
    "3": {
      "_id": new ObjectID("000000000000000000000003"),
      "contents": []
    },
    "2": {
      "_id": new ObjectID("000000000000000000000002"),
      "contents": []
    },
    "1": {
      "_id": new ObjectID("000000000000000000000001"),
      "contents": []
    }
  }
};

/**
 * Adds any desired indexes to the database.
 */
function addIndexes(db, cb) {
  db.collection('contentItems').createIndex({ "contents.contents": "text" }, null, cb);
}

/**
 * Resets a collection.
 */
function resetCollection(db, name, cb) {
  // Drop / delete the entire object collection.
  db.collection(name).drop(function() {
    // Get all of the mock objects for this object collection.
    var collection = initialData[name];
    var objects = Object.keys(collection).map(function(key) {
      return collection[key];
    });
    // Insert objects into the object collection.
    db.collection(name).insertMany(objects, cb);
  });
}

/**
 * Reset the MongoDB database.
 * @param db The database connection.
 */
function resetDatabase(db, cb) {
  // The code below is a bit complex, but it basically emulates a
  // "for" loop over asynchronous operations.
  var collections = Object.keys(initialData);
  var i = 0;

  // Processes the next collection in the collections array.
  // If we have finished processing all of the collections,
  // it triggers the callback.
  function processNextCollection() {
    if (i < collections.length) {
      var collection = collections[i];
      i++;
      // Use myself as a callback.
      resetCollection(db, collection, processNextCollection);
    } else {
      addIndexes(db, cb);
    }
  }

  // Start processing the first collection!
  processNextCollection();
}

// Check if called directly via 'node', or required() as a module.
// http://stackoverflow.com/a/6398335
if(require.main === module) {
  // Called directly, via 'node src/resetdatabase.js'.
  // Connect to the database, and reset it!
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/' + databaseName;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw new Error("Could not connect to database: " + err);
    } else {
      console.log("Resetting database...");
      resetDatabase(db, function() {
        console.log("Database reset!");
        // Close the database connection so NodeJS closes.
        db.close();
      });
    }
  });
} else {
  // require()'d.  Export the function.
  module.exports = resetDatabase;
}
