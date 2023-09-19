const { Client } = require('cassandra-driver');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'mykeyspace'
});

client.connect()
  .then(() => console.log('Connected to Cassandra'))
  .catch(err => console.error('Error connecting to Cassandra', err));

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/users', (req, res) => {
  const { id, name, email } = req.body;

  const query = 'INSERT INTO users (id, name, email) VALUES (?, ?, ?)';
  const params = [id, name, email];

  client.execute(query, params, { prepare: true })
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error('Error inserting user', err);
      res.sendStatus(500);
    });
});
