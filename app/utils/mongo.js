import Promise from 'bluebird';
import { MongoClient } from 'mongodb';

const db_uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/'
const db_name = 'notifications'
const db_userpref_collection = 'userprefs';

var saved_dbo_ref;

export function mongoConnect() {
	return new Promise((success, failure) => {
		MongoClient.connect(db_uri).then((db) => {
			saved_dbo_ref = db.db(db_name);
		  console.log('Connected to MongoDB successfully!');
		  return success();
		}).catch((err) => {
			console.log('Error connecting to MongoDB!');
			  console.log(err);
			  return failure(err);
		}); 
	});
};

export function getByUserId(user_id) {
	return new Promise(function(success, failure) {
		const collection = saved_dbo_ref.collection(db_userpref_collection);
		const query = { userId: user_id };
		collection.find(query).toArray((err, docs) => {
			if (err) {
				console.log('Error looking up document!');
				console.log(err);
				return failure(err);
			}

			return success(docs);
		});
	});
};

export function insertUserPref(user_id, opt_in_bool) {
	return new Promise(function(success, failure) {
		const collection = saved_dbo_ref.collection(db_userpref_collection);
		const query = { userId: user_id, optIn: opt_in_bool };
		collection.insert(query).toArray((err, doc) => {
			if (err) {
				console.log('Error inserting document!');
				console.log(err);
				return failure(err);
			}

			return success(doc);
		});
	});
};

export function disconnect() {
	try {
		saved_dbo_ref.close();
	} catch (e) {
		return;
	}
};

/// Runs a simple query to check connection is maintained.
export function mongoHealth() {
	return new Promise(function(success, failure) {
		const collection = saved_dbo_ref.collection(db_userpref_collection);
		const query = { userId: "123" };
		collection.find(query).toArray((err, docs) => {
			if (err) {
				console.log('Error looking up health document!');
				console.log(err);
				return failure(err);
			}

			return success(docs);
		});
	});
};
