const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../generated/prisma');
const { body, validationResult } = require('express-validator');


const { generateToken } = require('../utils/jwt');
const { authMiddleware } = require('../middlewars/auth.middleware');
const router = express.Router();
const prisma = new PrismaClient();









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

    try {
      const { username, firstname, lastname, password } = req.body;

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { username, firstname, lastname, password: hashed },
      });

      res.status(201).json({ message: 'Inscription réussie', username: user.username });
    } catch (err) {
      console.error('Erreur lors de l’inscription :', err);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
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

    try {
      const { username, password } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      const token = generateToken(user);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000,
        role: user.role

      });

      res.status(200).json({ message: 'Connecté avec succès' });
    } catch (err) {
      console.error('Erreur lors de la connexion :', err);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
);






router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: 'Déconnecté avec succès' });
});




router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        role : true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur :", err);
    res.status(
      500).json({ message: "Erreur interne du serveur" });
  }
});










router.get('/', authMiddleware, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
});