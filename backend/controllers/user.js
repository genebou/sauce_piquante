const bcrypt = require('bcrypt');// ici, on importe bcrypt pour pouvoir hasher le mot de passe
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //on hash le mot de passe avec bcrypt
        .then(hash => { 
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    
};
//on cherche l'utilisateur dans la base de données
//si l'utilisateur n'existe pas on renvoie une erreur
exports.login = (req, res, next) => {
User.findOne({ email: req.body.email })

    .then(user => {
        //si l'utilisateur n'existe pas
        if (user === null) {
            res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect!' });
        }else{
            //si l'utilisateur existe on compare le mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                    res.status(401).json({ error: 'Paire identifiant/mot de passe incorrect!' });
                }else{
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'Random_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                });
            }
        })
        //erreur serveur
          .catch(error => res.status(500).json({ error }));
                
        }
    })
        .catch(error => res.status(500).json({ error })); //erreur serveur
        
};
