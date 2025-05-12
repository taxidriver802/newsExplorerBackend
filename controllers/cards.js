const Card = require('../models/card');

const {
  StatusBadRequest,
  StatusUnauthorized,
  StatusNotFound,
} = require('../utils/StatusError/index');

const getFavCards = (req, res, next) => {
  console.log(req);

  const { _id } = req.user;
  return Card.find({ owner: _id })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new StatusBadRequest('Invalid card ID'));
      }
      return next(err);
    });
};

const favoriteCard = (req, res, next) => {
  const { _id } = req.user;
  const {
    urlToImage,
    title,
    publishedAt,
    description,
    sourceName,
    url,
    keyword,
  } = req.body;

  return Card.create({
    urlToImage,
    title,
    publishedAt,
    description,
    sourceName,
    url,
    keyword,
    owner: _id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new StatusBadRequest('Invalid card data'));
      }
      return next(err);
    });
};

const deleteFavCard = (req, res, next) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return next(new StatusNotFound('Card not found'));
      }
      if (String(card.owner) !== String(_id)) {
        return next(
          new StatusUnauthorized('You are not authorized to delete this card')
        );
      }
      res.status(200).send({ message: 'Card deleted successfully' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new StatusBadRequest('Invalid card ID'));
      }
      return next(err);
    });
};

module.exports = {
  getFavCards,
  deleteFavCard,
  favoriteCard,
};
