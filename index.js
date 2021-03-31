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

app.get('/cards/add/:id', (req, res) => {
  const { id } = req.params;
  const template = pug.compileFile('views/_add-card.pug');
  const markup = template({ id });
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
    label
  };
  const template = pug.compileFile('views/_card.pug');
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
  const template = pug.compileFile('views/_list.pug');
  const markup = template({ list: newList } );
  res.send(markup);

});
app.listen(PORT);

console.log('Listening on port: ', PORT);


