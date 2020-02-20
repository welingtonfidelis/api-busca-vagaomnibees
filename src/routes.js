const express = require('express')
const routes = express.Router()

const Omnibees = require('./controllers/Omnibees');

//busca de quartos
routes.post('/searchbydate', (req, res) => {
    Omnibees.searchByDate(req, res);
});
// routes.get('/user', (req, res) => {
//     UserController.getAll(req, res)
// });
// routes.get('/user/byuser', (req, res) => {
//     UserController.getByUser(req, res)
// });
// routes.get('/user/byemail', (req, res) => {
//     UserController.getByEmail(req, res)
// });
// routes.get('/user/:id', (req, res) => {
//     UserController.get(req, res)
// });
// routes.get('/user/logs/:id', (req, res) => {
//     UserController.getUserLogs(req, res)
// });
// routes.put('/user/:id', (req, res) => {
//     UserController.update(req, res)
// });
// routes.delete('/user/:id', (req, res) => {
//     UserController.delete(req, res)
// });



module.exports = routes