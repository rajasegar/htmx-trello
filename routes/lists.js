const express = require('express');
const pug = require('pug');
const lists = require('../data/lists');

const listsRouter = express.Router();

listsRouter.get('/add', (req, res) => {
  const template = pug.compileFile('views/_add-list.pug');
  const markup = template({  });
  res.send(markup);
});

listsRouter.post('/', (req,res) => {
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

listsRouter.get('/cancel', (req,res) => {
  const template = pug.compileFile('views/_new-list.pug');
  const markup = template({  } );
  res.send(markup);
});

module.exports = listsRouter;
