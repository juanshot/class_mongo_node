const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const credentials = require('./credentials');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/config', (req, res) => {
   MongoClient.connect(credentials.url, { useNewUrlParser: true }, (err, client) => {
      if (!err) {
        const collection = client.db(credentials.db).collection('nativeMongo');
        collection.insertOne(req.body, (err, result) => {
          if (!err) {
            res.send(result)
          } else {
            res.send('error saving', err)
          }
        })
      } else {
        res.send('There was an err conecting', err)
      }
      client.close();
    });
});
app.get('/config', (req, res) => {
  MongoClient.connect(credentials.url, { useNewUrlParser: true }, (err, client) => {
      const collection = client.db(credentials.db).collection('nativeMongo');
      collection.find({...req.query}).toArray((err, result) => {
        if (!err) {
          res.send(result);
        } else {
          res.send('Error querying')
        }
        client.close()
      });
  });
});

app.get('/config/:id', (req, res) => {
    MongoClient.connect(credentials.url, { useNewUrlParser: true }, (err, client) => {
        const collection = client.db(credentials.db).collection('nativeMongo');
        collection.find({_id: ObjectId(req.params.id) }).toArray((err, result) => {
          if (!err) {
            res.send(result);
          } else {
            res.send('Error querying')
          }
          client.close()
        });
    });
});

app.patch('/config/:id', (req, res) => {
    MongoClient.connect(credentials.url, { useNewUrlParser: true }, (err, client) => {
        const collection = client.db(credentials.db).collection('nativeMongo');
        collection.findAndModify({ _id: ObjectId(req.params.id) }, null, { ...req.body }, (err, result) => {
          if(!err) {
            res.send(result);
          } else {
            res.send(' Ha habido un error');
          }
          client.close()
        });
    });
});

app.listen(3039, () => {
    console.log('the server has started...')
});