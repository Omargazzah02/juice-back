const { verifyToken } = require('../utils/jwt');
const JWT_SECRET = process.env.JWT_SECRET 


function authMiddleware(req, res, next) {
  const token = req.cookies.token; 

  if (!token) return res.status(401).json({ message: 'Token manquant' });

 
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalide' });
  }
}




function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    console.log(req.user.role)
    next(); 
  } else {
    res.status(403).json({ message: 'Accès refusé : rôle administrateur requis.' });
  }
}



module.exports = {authMiddleware, isAdmin};



 