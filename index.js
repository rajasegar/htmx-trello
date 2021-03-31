const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');

const lists = require('./data/lists');

const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.render('index', { lists });
});

app.get('/cards/add', (req, res) => {
  const template = pug.compileFile('views/_add-card.pug');
  const markup = template();
  res.send(markup);
});

app.get('/cards/cancel', (req, res) => {
  const template = pug.compileFile('views/_toggle-add-card.pug');
  const markup = template();
  res.send(markup);
});

app.listen(PORT);

console.log('Listening on port: ', PORT);


