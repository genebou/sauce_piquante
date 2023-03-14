const mongoose = require('mongoose');
//importation du package express
const express = require('express');
//création de l'application express
const userRoutes = require('./routes/user');
const bcrypt = require('bcrypt');
const app = express();
//accès au corps de la requête
app.use(express.json());


// middleware pour éviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

mongoose.connect('mongodb+srv://genevievebourchis:67975y5l@cluster0.nhotc3b.mongodb.net/test?retryWrites=true&w=majority', 
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
// middleware
//route vers la route auth.signup 



app.use('/api/auth', userRoutes);


 //exportation de l'application express pour pouvoir y accéder depuis les autres fichiers du projet   
module.exports = app;