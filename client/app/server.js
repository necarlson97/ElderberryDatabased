var token = 'eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNCJ9';
/**
 * Properly configure+send an XMLHttpRequest with error handling, authorization token,
 * and other needed properties.
 */
function sendXHR(verb, resource, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(verb, resource);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);

  // The below comment tells ESLint that FacebookError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /* global FacebookError */

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status;
    var statusText = xhr.statusText;
    if (statusCode >= 200 && statusCode < 300) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(xhr);
    } else {
      // Client or server error.
      // The server may have included some response text with details concerning
      // the error.
      var responseText = xhr.responseText;
      console.log('Could not ' + verb + " " + resource + ": Received " + statusCode + " " + statusText + ": " + responseText);
    }
  });

  // Time out the request if it takes longer than 10,000 milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    console.log('Could not ' + verb + " " + resource + ": Could not connect to the server.");
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    consolo.console.log();('Could not ' + verb + " " + resource + ": Request timed out.");
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send();
      break;
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(body);
      break;
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body));
      break;
    default:
      throw new Error('Unknown body type: ' + typeof(body));
  }
}

/**
 * Emulates a REST call to get the masterFolder data for a particular user.
 */
export function getMasterFolderData(user, cb) {
   sendXHR('GET', '/user/000000000000000000000004/masterFolder', undefined, (xhr) => {
     // Call the callback with the data.
     cb(JSON.parse(xhr.responseText));
   });
 }

/**
 * Adds a new note update to the database.
 */
export function postNote(user, location, contents, cb) {
  sendXHR('POST', '/contentitem', {
    userId: user,
    location: location,
    contents: contents
  }, (xhr) => {
    // Return the new note update.
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * Adds a new note update to the database.
 */
export function postLocatedNote(user, contents, cb) {
  sendXHR('POST', '/contentitem', {
    userId: user,
    location: "",
    contents: contents
  }, (xhr) => {
    // Return the new note update.
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * Updates the text in a masterFolder item (assumes a note update)
 */
export function updateContentItemText(contentItemId, newContent, cb) {
  sendXHR('PUT', '/contentitem/' + contentItemId + '/content', newContent, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}

/**
 * Deletes a masterFolder item.
 */
export function deleteContentItem(contentItemId, cb) {
  sendXHR('DELETE', '/contentitem/' + contentItemId, undefined, () => {
    cb();
  });
}

/**
 * Searches for masterFolder items with the given text.
 */
export function searchForContentItems(queryText, cb) {
  sendXHR('POST', '/search', queryText, (xhr) => {
    cb(JSON.parse(xhr.responseText));
  });
}
