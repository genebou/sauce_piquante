const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

// modifiez la route POST pour utiliser le middleware auth et multer
router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing); 
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllThings)
    
module.exports = router;
