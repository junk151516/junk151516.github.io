/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/dispositivos              ->  index
 * POST    /api/dispositivos              ->  create
 * GET     /api/dispositivos/:id          ->  show
 * PUT     /api/dispositivos/:id          ->  update
 * DELETE  /api/dispositivos/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Dispositivo from './dispositivo.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Dispositivos
export function index(req, res) {
  return Dispositivo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Dispositivo from the DB
export function show(req, res) {
  return Dispositivo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Dispositivo in the DB
export function create(req, res) {
  return Dispositivo.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Dispositivo in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Dispositivo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Dispositivo from the DB
export function destroy(req, res) {
  return Dispositivo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
