import Promise from 'bluebird';
import { MongoClient } from 'mongodb';
import log from './logger';

const dbURI = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/';
const dbName = 'notifications';
const dbUserPrefCollection = 'userprefs';

let savedDBORef;

export function mongoConnect() {
  return new Promise((success, failure) => {
    MongoClient.connect(dbURI).then((db) => {
      savedDBORef = db.db(dbName);
      log('Connected to MongoDB successfully!');
      return success();
    }).catch((err) => {
      log('Error connecting to MongoDB!');
      log(err);
      return failure(err);
    });
  });
}

export function getByUserId(userId) {
  return new Promise(((success, failure) => {
    const collection = savedDBORef.collection(dbUserPrefCollection);
    const query = { userId };
    collection.find(query).toArray((err, docs) => {
      if (err) {
        log('Error looking up document!');
        log(err);
        return failure(err);
      }

      return success(docs);
    });
  }));
}

export function insertUserPref(userId, optIn) {
  return new Promise(((success, failure) => {
    const collection = savedDBORef.collection(dbUserPrefCollection);
    const query = { userId, optIn };
    collection.insert(query).toArray((err, doc) => {
      if (err) {
        log('Error inserting document!');
        log(err);
        return failure(err);
      }

      return success(doc);
    });
  }));
}

export function disconnect() {
  try {
    savedDBORef.close();
  } catch (e) {
    log('Caught error on DB close. Taking no action.');
  }
}

//  Runs a simple query to check connection is maintained.
export function mongoHealth() {
  return new Promise(((success, failure) => {
    const collection = savedDBORef.collection(dbUserPrefCollection);
    const query = { userId: '123' };
    collection.find(query).toArray((err, docs) => {
      if (err) {
        log('Error looking up health document!');
        log(err);
        return failure(err);
      }

      return success(docs);
    });
  }));
}
