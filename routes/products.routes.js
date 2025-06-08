const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const { authMiddleware, isAdmin } = require('../middlewars/auth.middleware');

const prisma = new PrismaClient();

// Ajouter un produit
router.post('/add',authMiddleware ,isAdmin, async (req, res  ) => {
  try {
    const { name, description, price , image } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price , image },
    });
    res.status(201).json(product);
    
  } catch (error) {
  res.status(500).send('Erreur serveur.');
  }
});

// Récupérer tous les produits
router.get('/',authMiddleware  ,  async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des produits' });
  }
});



// Récupérer tous les produits
router.get('/details/:productId',authMiddleware  ,  async (req, res) => {
  try {
  const  productId = Number(req.params.productId)
   const product = await prisma.product.findUnique({
    where: {
      id : productId
    }
   })

   if (!product) { 
    res.status(404).json({message : 'produit non trouvé ! '})
   }


   res.status(200).json(product)













  } catch (error) {
   res.status(500).send('Erreur serveur.');

  }
});














module.exports = router;
