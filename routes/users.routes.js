const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const { authMiddleware, isAdmin } = require('../middlewars/auth.middleware');
const { use } = require('react');

const prisma = new PrismaClient();


router.get ('/' , authMiddleware , isAdmin , async (req , res)=> {

    try {

        const users = prisma.user.findMany()
        res.json(users)
 

    } catch(error) {
        console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des produits' });

    }





})







module.exports = router;
