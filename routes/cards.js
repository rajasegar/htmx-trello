const express = require('express');
const pug = require('pug');
const { v1 } = require('uuid');

const lists = require('../data/lists');
const cardsRouter = express.Router();

cardsRouter.get('/add/:id', (req, res) => {
  const { id } = req.params;
  const template = pug.compileFile('views/_add-card.pug');
  const markup = template({ id });
  res.send(markup);
});

cardsRouter.get('/edit/:list_id/:id', (req, res) => {
  const { list_id, id } = req.params;
  console.log(req.params);

  const list = lists.find(l => l.id == list_id);
  console.log(list);
  const card = list.cards.find(c => c.id == id);
  const template = pug.compileFile('views/_edit-card.pug');
  const markup = template({ id, list, card });
  res.send(markup);
});

cardsRouter.put('/:list_id/:id', (req, res) => {
  const { label } = req.body;
  const { list_id, id } = req.params;
  const list = lists.find(l => l.id == list_id);
  const card = list.cards.find(c => c.id == id);
  card.label = label;
  const template = pug.compileFile('views/_card.pug');
  const markup = template({ card, list } );
  res.send(markup);
});

cardsRouter.get('/cancel/:id', (req, res) => {
  const { id } = req.params;
  const list = lists.find(l => l.id == id);
  const template = pug.compileFile('views/_toggle-add-card.pug');
  const markup = template({ list });
  res.send(markup);
});

cardsRouter.get('/cancel-edit/:list_id/:id', (req,res) => {

  const { list_id, id } = req.params;
  console.log(req.params);
  const list = lists.find(l => l.id == list_id);
  console.log(list);
  const card = list.cards.find(c => c.id == id);
  const template = pug.compileFile('views/_card.pug');
  const markup = template({ id, list, card });
  res.send(markup);
});



cardsRouter.delete('/:list_id/:id', (req,res) => {
  const { list_id, id } = req.params;
  console.log(req.params);

  const list = lists.find(l => l.id == list_id);
  console.log(list);
  list.cards = list.cards.filter(c => c.id != id);
  res.send('');
});

cardsRouter.post('/move', (req, res) => {
  console.log(req.body);
  const { from , to , movedCard } = req.body;
  const [,fromId] = from.split('-');
  const [,toId] = to.split('-');
  const cardId = movedCard.replace('card-','');


  const fromList = lists.find(l => l.id == fromId);
  const card = fromList.cards.find(c => c.id == cardId);
  card.list = toId;
  fromList.cards = fromList.cards.filter(c => c.id != cardId);

  const toList = lists.find(l => l.id == toId);
  toList.cards.push(card);

  const template = pug.compileFile('views/_board.pug');
  const markup = template({ lists } );
  res.send(markup);
});

cardsRouter.post('/new/:listId', (req,res) => {
  console.log(req.body);
  const { listId } = req.params;
  const label = req.body['label-' + listId];
  const list = lists.find(l => l.id == listId);
  const card = {
    label,
    id: v1(),
    list: listId
  };
  list.cards.push(card);
  const template = pug.compileFile('views/_new-card.pug');
  const markup = template({ card, list } );
  res.send(markup);
});


module.exports = cardsRouter;
