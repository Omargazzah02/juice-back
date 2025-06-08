const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, isAdmin } = require('../middlewars/auth.middleware');



const prisma = new PrismaClient();




router.post('/add' ,authMiddleware , async (req,res) => {
  try {
    userId = req.user.userId;
    const {items} = req.body
   let  totalAmount  = 0;
   items.forEach(item => {
    totalAmount += item.quantity * item.price
    
   });


    order = await prisma.order.create({
      data : {
        userId : userId,
        totalAmount  : totalAmount,
        ordersProducts : { 
          create : items.map(item => ({
            productId : item.productId,
            quantity :item.quantity
          }))

        },

      

      } ,

        include :{
          ordersProducts :true
        }
        



    }
  )
      res.status(201).json(order);





    
  

    
    

  }catch(error){

      res.status(500).send('Erreur serveur.');

 

  }
})



router.get('/' , authMiddleware , async (req,res)=> {
    try {
    
        userId = req.user.userId
        const orders = await prisma.order.findMany({
            where : {userId : userId},
            

        })

        res.status(200).json (
            orders
        )

    } catch (err) {
        console.log(err)
       res.json(err)


    }
})



/
router.get('/products/:order_id' , authMiddleware , async (req,res)=> {
    try {
      const   orderId = Number(req.params.order_id)
       const userId = Number( req.user.userId)

      const   order  = await prisma.order.findUnique({
            where:{
                id : orderId
                
            }

        }

            
        )
        if (order.userId != userId || order ==null  ) {
        res.status(404).json({"message" : "Commande n'existe pas !"})

        } 
        const  ordersProducts  = await prisma.orders_products.findMany({
            where : {orderId : orderId
             },
       
            
            

        })



      const products = await Promise.all(
  ordersProducts.map(orderProduct => {
    return prisma.product.findUnique({
      where: {
        id: orderProduct.productId
      }
    });
  })
);




        res.status(200).json (
            products
        )

    } catch (err) {
          res.status(500).send('Erreur serveur.');



    }
})






module.exports = router ;