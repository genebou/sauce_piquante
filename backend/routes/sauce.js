//ajouter les routes pour les sauces
// ajout plugin pour utiliser Express router
const express = require('express');
// appel au router avec la méthode express
const router = express.Router();
// association des fonctions aux différentes routes, import du controller
const sauceCtrl = require('../controllers/sauce');
//ajout du middleware multer pour gérer les images
const multer = require('../middleware/multer-config');
//ajout du middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');

//ajout des routes pour les sauces

//--Create Sauce-- 
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/',auth,sauceCtrl.getAllSauces);
router.get('/:id',auth,sauceCtrl.getOneSauce);
router.put('/:id',auth,multer,sauceCtrl.modifySauce);
router.delete('/:id',auth,sauceCtrl.deleteSauce);
router.post('/:id/like',auth,sauceCtrl.likeSauce);

    
module.exports = router;

/*//---------------------------- SAUCE ROUTES --------------------------------

//--Add plugin to use Express router--
const express = require("express");

//--Call to Router with express method-- 
const router = express.Router();

//--Associate functions to differents routes, - Import Controller--
const sauceCtrl = require("../controllers/sauce");

//--Import auth middleware to secure Routes--
const auth = require('../middleware/auth');

//--Import multer middleware to manage Images--
const multer = require("../middleware/multer-config");


module.exports = router;*/
