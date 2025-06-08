const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');


const { generateToken } = require('../utils/jwt');
const { authMiddleware } = require('../middlewars/auth.middleware');
const router = express.Router();
const prisma = new PrismaClient();








router.get('/me',authMiddleware,(req, res) => {
  res.json({ message: `Bienvenue utilisateur ${req.user.userId} avec rôle ${req.user.role}` });
});

module.exports = router;


router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Nom d’utilisateur requis'),
    body('firstname').notEmpty().withMessage('Prénom requis'),
    body('lastname').notEmpty().withMessage('Nom requis'),
    body('password').isLength({ min: 8 }).withMessage('Mot de passe ≥ 8 caractères'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, firstname, lastname, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, firstname, lastname, password: hashed    },
    });
    res.status(201).json({ message: 'Inscription réussie', username: user.username });
  }
);




router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Nom d’utilisateur requis'),
    body('password').notEmpty().withMessage('Mot de passe requis'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });



    
    const token = generateToken(user);
   
     // 4. Envoyer le token dans un cookie HttpOnly
   res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // uniquement HTTPS en prod
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
  

      res.status(200).json({ message: 'Connecté avec succès'});



  }
);



