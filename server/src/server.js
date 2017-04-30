// Imports the express Node module.
var express = require('express');
// Creates an Express server.
var app = express();
// Parses response bodies.
var bodyParser = require('body-parser');

var NoteSchema = require('./schemas/notes.json');

var validate = require('express-jsonschema').validate;
var mongo_express = require('mongo-express/lib/middleware');
// Import the default Mongo Express configuration
var mongo_express_config = require('mongo-express/config.default.js');

var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var url = 'mongodb://localhost:27017/Jeeves';

MongoClient.connect(url, function(err, db) {
  // Put everything that uses `app` into this callback function.
  // from app.use(bodyParser.text());
  // all the way to
  // app.listen(3000, ...
  // Also put all of the helper functions that use mock database
  // methods like readDocument, writeDocument, ...

app.use('/mongo_express', mongo_express(mongo_express_config));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.static('../client/build'));

/**
 * Resolves a masterFolder item. Internal to the server, since it's synchronous.
 * @param contentItemId The masterFolder item's ID. Must be an ObjectID.
 * @param callback Called when the operation finishes. First argument is an error object,
 *   which is null if the operation succeeds, and the second argument is the
 *   resolved masterFolder item.
 */
function getContentItem(contentItemId, callback) {
  // Get the masterFolder item with the given ID.
  db.collection('contentItems').findOne({
    _id: contentItemId
  }, function(err, contentItem) {
    if (err) {
      // An error occurred.
      return callback(err);
    } else if (contentItem === null) {
      // MasterFolder item not found!
      return callback(null, null);
    }

    // Build a list of all of the user objects we need to resolve.
    // Start off with the author of the contentItem.
    var userList = [contentItem.contents.author];

    resolveUserObjects(userList, function(err, userMap) {
      if (err) {
        return callback(err);
      }
      // Use the userMap to look up the author's user object
      contentItem.contents.author = userMap[contentItem.contents.author];

      // Return the resolved contentItem!
      callback(null, contentItem);
    });
  });
}

/**
 * Resolves a list of user objects. Returns an object that maps user IDs to
 * user objects.
 */
function resolveUserObjects(userList, callback) {
  // Special case: userList is empty.
  // It would be invalid to query the database with a logical OR
  // query with an empty array.
  if (userList.length === 0) {
    callback(null, {});
  } else {
    // Build up a MongoDB "OR" query to resolve all of the user objects
    // in the userList.
    var query = {
      $or: userList.map((id) => { return {_id: id } })
    };
    // Resolve 'like' counter
    db.collection('users').find(query).toArray(function(err, users) {
      if (err) {
        return callback(err);
      }
      // Build a map from ID to user object.
      // (so userMap["4"] will give the user with ID 4)
      var userMap = {};
      users.forEach((user) => {
        userMap[user._id] = user;
      });
      callback(null, userMap);
    });
  }
}
/**
 * Get the masterFolder data for a particular user.
 * @param user The ObjectID of the user document.
 */
function getMasterFolderData(user, callback) {
  db.collection('users').findOne({
    _id: user
  }, function(err, userData) {
    if (err) {
      return callback(err);
    } else if (userData === null) {
      // User not found.
      return callback(null, null);
    }

    db.collection('masterFolders').findOne({
      _id: userData.masterFolder
    }, function(err, masterFolderData) {
      if (err) {
        return callback(err);
      } else if (masterFolderData === null) {
        // MasterFolder not found.
        return callback(null, null);
      }

      // We will place all of the resolved MasterFolderItems here.
      // When done, we will put them into the MasterFolder object
      // and send the MasterFolder to the client.
      var resolvedContents = [];

      // processNextMasterFolderItem is like an asynchronous for loop:
      // It performs processing on one masterFolder item, and then triggers
      // processing the next item once the first one completes.
      // When all of the masterFolder items are processed, it completes
      // a final action: Sending the response to the client.
      function processNextContentItem(i) {
        // Asynchronously resolve a masterFolder item.
        getContentItem(masterFolderData.contents[i], function(err, contentItem) {
          if (err) {
            // Pass an error to the callback.
            callback(err);
          } else {
            // Success!
            resolvedContents.push(contentItem);
            if (resolvedContents.length === masterFolderData.contents.length) {
              // I am the final masterFolder item; all others are resolved.
              // Pass the resolved masterFolder document back to the callback.
              masterFolderData.contents = resolvedContents;
              callback(null, masterFolderData);
            } else {
              // Process the next masterFolder item.
              processNextContentItem(i + 1);
            }
          }
        });
      }

      // Special case: MasterFolder is empty.
      if (masterFolderData.contents.length === 0) {
        callback(null, masterFolderData);
      } else {
        processNextContentItem(0);
      }
    });
  });
}

/**
 * Get the user ID from a token. Returns -1 (an invalid ID) if it fails.
 */
function getUserIdFromToken(authorizationLine) {
  try {
    // Cut off "Bearer " from the header value.
    var token = authorizationLine.slice(7);
    // Convert the base64 string to a UTF-8 string.
    var regularString = new Buffer(token, 'base64').toString('utf8');
    // Convert the UTF-8 string into a JavaScript object.
    var tokenObj = JSON.parse(regularString);
    var id = tokenObj['id'];
    // Check that id is a number.
    if (typeof id === 'string') {
      return id;
    } else {
      // Not a number. Return "", an invalid ID.
      return "";
    }
  } catch (e) {
    // Return an invalid ID.
    return -1;
  }
}

/**
 * Get the masterFolder data for a particular user.
 */
app.get('/user/:userid/masterFolder', function(req, res) {
  var userid = req.params.userid;
  var fromUser = getUserIdFromToken(req.get('Authorization'));
  if (fromUser === userid) {
    // Convert userid into an ObjectID before passing it to database queries.
   getMasterFolderData(new ObjectID(userid), function(err, masterFolderData) {
     if (err) {
       // A database error happened.
       // Internal Error: 500.
       res.status(500).send("Database error: " + err);
     } else if (masterFolderData === null) {
       // Couldn't find the masterFolder in the database.
       res.status(400).send("Could not look up masterFolder for user " + userid);
     } else {
       // Send data.
       res.send(masterFolderData);
     }
   });
  } else {
    // 403: Unauthorized request.
    res.status(403).end();
  }
});

/**
 * Adds a new status update to the database.
 * @param user ObjectID of the user.
 */
function postNote(user, location, contents, image, callback) {
  // Get the current UNIX time.
  var time = new Date().getTime();
  // The new status update. The database will assign the ID for us.
  var newNote = {
    "type": "note",
    "contents": {
      "author": user,
      "postDate": time,
      "location": location,
      "contents": contents
    }
  };

  // Add the content item to the database.
  db.collection('contentItems').insertOne(newNote, function(err, result) {
    if (err) {
      return callback(err);
    }
    // Unlike the mock database, MongoDB does not return the newly added object
    // with the _id set.
    // Attach the new masterFolder item's ID to the newNote object. We will
    // return this object to the client when we are done.
    // (When performing an insert operation, result.insertedId contains the new
    // document's ID.)
    newNote._id = result.insertedId;

    // Retrieve the author's user object.
    db.collection('users').findOne({ _id: user }, function(err, userObject) {
      if (err) {
        return callback(err);
      }
      // Update the author's masterFolder with the new status update's ID.
      db.collection('masterFolders').updateOne({ _id: userObject.masterFolder },
        {
          $push: {
            contents: {
              $each: [newNote._id],
              $position: 0
            }
          }
        },
        function(err) {
          if (err) {
            return callback(err);
          }
          // Return the new status update to the application.
          callback(null, newNote);
        }
      );
    });
  });
}

//`POST /contentitem { userId: user, location: location, contents: contents  }`
app.post('/contentitem', validate({ body: NoteSchema }), function(req, res) {
  // If this function runs, `req.body` passed JSON validation!
  var body = req.body;
  var fromUser = getUserIdFromToken(req.get('Authorization'));

  // Check if requester is authorized to post this status update.
  // (The requester must be the author of the update.)
  if (fromUser === body.userId) {
    postNote(new ObjectID(fromUser), body.location, body.contents, body.image, function(err, newUpdate) {
      if (err) {
        // A database error happened.
        // 500: Internal error.
        res.status(500).send("A database error occurred: " + err);
      } else {
        // When POST creates a new resource, we should tell the client about it
        // in the 'Location' header and use status code 201.
        res.status(201);
        res.set('Location', '/contentitem/' + newUpdate._id);
          // Send the update!
        res.send(newUpdate);
      }
    });
  } else {
    // 401: Unauthorized.
    res.status(401).end();
  }
});

/**
 * Helper function: Sends back HTTP response with error code 500 due to
 * a database error.
 */
function sendDatabaseError(res, err) {
  res.status(500).send("A database error occurred: " + err);
}

// `PUT /contentitem/contentItemId/content newContent`
app.put('/contentitem/:contentitemid/content', function(req, res) {
  var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
  var contentItemId = new ObjectID(req.params.contentitemid);

  // Only update the masterFolder item if the author matches the currently authenticated
  // user.
  db.collection('contentItems').updateOne({
    _id: contentItemId,
    // This is how you specify nested fields on the document.
    "contents.author": fromUser
  }, { $set: { "contents.contents": req.body } }, function(err, result) {
    if (err) {
      return sendDatabaseError(res, err);
    } else if (result.modifiedCount === 0) {
      // Could not find the specified masterFolder item. Perhaps it does not exist, or
      // is not authored by the user.
      // 400: Bad request.
      return res.status(400).end();
    }

    // Update succeeded! Return the resolved masterFolder item.
    getContentItem(contentItemId, function(err, contentItem) {
      if (err) {
        return sendDatabaseError(res, err);
      }
      res.send(contentItem);
    });
  });
});

// `DELETE /contentitem/:id`
app.delete('/contentitem/:contentitemid', function(req, res) {
  var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
  var contentItemId = new ObjectID(req.params.contentitemid);

  // Check if authenticated user has access to delete the masterFolder item.
  db.collection('contentItems').findOne({
    _id: contentItemId,
    "contents.author": fromUser
  }, function(err, contentItem) {
    if (err) {
      return sendDatabaseError(res, err);
    } else if (contentItem === null) {
      // Could not find the specified masterFolder item. Perhaps it does not exist, or
      // is not authored by the user.
      // 400: Bad request.
      return res.status(400).end();
    }

    // User authored the masterFolder item!
    // Remove masterFolder item from all masterFolders using $pull and a blank filter.
    // A blank filter matches every document in the collection.
    db.collection('masterFolders').updateMany({}, {
      $pull: {
        contents: contentItemId
      }
    }, function(err) {
      if (err) {
        return sendDatabaseError(res, err);
      }

      // Finally, remove the masterFolder item.
      db.collection('contentItems').deleteOne({
        _id: contentItemId
      }, function(err) {
        if (err) {
          return sendDatabaseError(res, err);
        }
        // Send a blank response to indicate success.
        res.send();
      });
    });
  });
});

//`POST /search queryText`
app.post('/search', function(req, res) {
  var fromUser = new ObjectID(getUserIdFromToken(req.get('Authorization')));
  if (typeof(req.body) === 'string') {
    // trim() removes whitespace before and after the query.
    // toLowerCase() makes the query lowercase.
    var queryText = req.body.trim().toLowerCase();
    // Get the user.
    db.collection('users').findOne({ _id: fromUser}, function(err, userData) {
      if (err) {
        return sendDatabaseError(res, err);
      } else if (userData === null) {
        // User not found.
        // 400: Bad request.
        res.status(400).end();
      }

      // Get the user's masterFolder.
      db.collection('masterFolders').findOne({ _id: userData.masterFolder }, function(err, masterFolderData) {
        if (err) {
          return sendDatabaseError(res, err);
        }

        // Look for masterFolder items within the masterFolder that contain queryText.
        db.collection('contentItems').find({
          $or: masterFolderData.contents.map((id) => { return { _id: id  }}),
          $text: {
            $search: queryText
          }
        }).toArray(function(err, items) {
          if (err) {
            return sendDatabaseError(res, err);
          }

          // Resolve all of the masterFolder items.
          var resolvedItems = [];
          var errored = false;
          function onResolve(err, contentItem) {
            if (errored) {
              return;
            } else if (err) {
              errored = true;
              sendDatabaseError(res, err);
            } else {
              resolvedItems.push(contentItem);
              if (resolvedItems.length === items.length) {
                // Send resolved items to the client!
                res.send(resolvedItems);
              }
            }
          }

          // Resolve all of the matched masterFolder items in parallel.
          for (var i = 0; i < items.length; i++) {
            // Would be more efficient if we had a separate helper that
            // resolved masterFolder items from their objects and not their IDs.
            // Not a big deal in our small applications, though.
            getContentItem(items[i]._id, onResolve);
          }

          // Special case: No results.
          if (items.length === 0) {
            res.send([]);
          }
        });
      });
    });
  } else {
    // 400: Bad Request.
    res.status(400).end();
  }
});


var ResetDatabase = require('./resetdatabase');
// Reset database.
app.post('/resetdb', function(req, res) {
  console.log("Resetting database...");
  // This is a debug route, so don't do any validation.
  ResetDatabase(db, function() {
   res.send();
 });
});

/**
 * Translate JSON Schema Validation failures into error 400s.
 */
app.use(function(err, req, res, next) {
  if (err.name === 'JsonSchemaValidation') {
    // Set a bad request http response status
    res.status(400).end();
  } else {
    // It's some other sort of error; pass it to next error middleware handler
    next(err);
  }
});

// Starts the server on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

});
// The file ends here. Nothing should be after this.
