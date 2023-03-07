const mongoose = require('mongoose');
const express = require('express');
const app = express();
mongoose.connect('mongodb+srv://genevievebourchis:a123456bh@cluster0.nhotc3b.mongodb.net/test?retryWrites=true&w=majority', 
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
    });
app.use((req, res, next) => {
    res.status(201);
    next();
    });

app.use((req, res,next) => {
    res.json({ message: 'Votre requête a bien été reçue!' });
    next();
    });

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
    });
    
module.exports = app;