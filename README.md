Étapes d'installation :
Installer les dépendances : npm install
Créer un fichier .env à la racine du projet avec les variables suivantes : DATABASE_URL=your_database_url_here   JWT_SECRET=your_jwt_secret_here
Utiliser XAMPP ou WampServer pour exécuter un serveur MySQL local.

Créer la base de données et les tables avec Prisma : npx prisma db push


Ajouter des produits dans la table product via phpMyAdmin avec la requête SQL suivante :
INSERT INTO product (name, image, price, description)
VALUES 
  ("Apple Juice (1000ml)", "https://preview.owasp-juice.shop/assets/public/images/products/apple_juice.jpg", 1.99, "The all-time classic."),
  ("Apple Pomace", "https://preview.owasp-juice.shop/assets/public/images/products/apple_pressings.jpg", 0.89, "Finest pressings of apples. Allergy disclaimer: Might contain traces of worms. Can be sent back to us for recycling."),
  ("Banana Juice (1000ml)", "https://preview.owasp-juice.shop/assets/public/images/products/banana_juice.jpg", 1.99, "Monkeys love it the most."),
  ("Eggfruit Juice (500ml)", "https://preview.owasp-juice.shop/assets/public/images/products/eggfruit_juice.jpg", 8.99, "Now with even more exotic flavour.");





executez la commande : node server.js








