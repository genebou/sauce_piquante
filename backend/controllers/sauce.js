//--Retrieve Sauce model--
const Sauce = require("../models/Sauce");

//--Retrieve Node file system module to manage Downloads & Images modification--
const fs = require("fs");

//--------------------------------Create Sauce------------------------------------- 
exports.createSauce = (req, res, next) => {
  console.log("1")
  const sauceObject = JSON.parse(req.body.sauce);
  //--Delete Id automatically generated & sent by Front-end - Sauce Id created in MongoDB
  delete sauceObject._id;
  //--Create model Sauce instance-- 
  const sauce = new Sauce({
    ...sauceObject,
      //--Modify Image URL--
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  //--Sauce saved in Database--
  sauce.save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée'}))
    .catch((error) => res.status(400).json({ error }));
};
    
//--------------------------------Modify Sauce------------------------------------- 
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Unauthorized request" });
      } else if (sauce.userId == req.auth.userId) {
         //--Delete old image from Server
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = req.file 
            ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
                }`,
              }
            : { ...req.body };
          Sauce.updateOne(
            //--Apply parameters of sauceObject--
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//--------------------------------Delete Sauce------------------------------------- 
exports.deleteSauce = (req, res, next) => {
  //--Searching Object to have Image URL & Delete Image file in Database--
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ error: "Unauthorized request" });
      } else if (sauce.userId == req.auth.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
         //--Calling unlink to delete file--
        fs.unlink(`images/${filename}`, () => {
          //--Delete document from Database--
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//--------------------------------Display All Sauces------------------------------------- 
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
//--------------------------------Display Only 1 Sauce------------------------------------- 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

//--------------------------------Manage Likes & Dislikes------------------------------------- 
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Ajout Like" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Ajout Dislike" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Suppression Like" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Suppression Dislike" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
