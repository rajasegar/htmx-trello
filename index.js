const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const { v1 } = require('uuid');

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

app.get('/cards/add/:id', (req, res) => {
  const { id } = req.params;
  const template = pug.compileFile('views/_add-card.pug');
  const markup = template({ id });
  res.send(markup);
});

app.get('/cards/edit/:list_id/:id', (req, res) => {
  debugger;
  const { list_id, id } = req.params;
  const list = lists.find(l => l.id == list_id);
  const card = list.cards.find(c => c.id == id);
  const template = pug.compileFile('views/_edit-card.pug');
  const markup = template({ id, list, card });
  res.send(markup);
});

app.put('/cards/:list_id/:id', (req, res) => {
  const { label } = req.body;
  const { list_id, id } = req.params;
  const list = lists.find(l => l.id == list_id);
  const card = list.cards.find(c => c.id == id);
  card.label = label;
  const template = pug.compileFile('views/_card.pug');
  const markup = template({ card, list } );
  res.send(markup);
});

app.get('/cards/cancel/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find(l => l.id == id);
  const template = pug.compileFile('views/_toggle-add-card.pug');
  const markup = template({ list });
  res.send(markup);
});

app.post('/cards', (req,res) => {
  console.log(req.body);
  const { label, listId } = req.body;
  const list = lists.find(l => l.id == listId);
  const card = {
    label,
    id: v1(),
    list: listId
  };
  const template = pug.compileFile('views/_new-card.pug');
  const markup = template({ card, list } );
  res.send(markup);
});

app.get('/lists/add', (req, res) => {
  const template = pug.compileFile('views/_add-list.pug');
  const markup = template({  });
  res.send(markup);
});

app.post('/lists', (req,res) => {
  const { name } = req.body;
  const newList = {
    name,
    id: lists.length + 1,
    cards: []
  };
  lists.push(newList);
  const template = pug.compileFile('views/_board.pug');
  const markup = template({ lists } );
  res.send(markup);

});
app.listen(PORT);

console.log('Listening on port: ', PORT);


