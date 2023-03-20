const   sauces = require('../models/sauces');


exports.createThing = (req, res, next) => {
  //parser l'objet requete pour en extraire les données
  const saucesObject = JSON.parse(req.body.thing);
  //supprimer l'id généré automatiquement par le frontend
  delete saucesObject._id;
  delete saucesObject._userId;
  const newsSauce = new sauces({
  //créer un objet Thing à partir de l'objet thingObject
  ...saucesObject,
  userId : req.auth.userId,
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
  //enregistrer l'objet Thing dans la base de données
  thing.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(error => res.status(400).json({ error }));
};