const fs = require("fs").promises
module.exports = {
    Query: {
        getWorld(parent, args, context) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            let produit = context.world.products.find(p => p.id === args.id)
            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                //augmentation de la quantité de produit
                produit.quantite = produit.quantite + args.quantite
                console.log(produit.quantite)

                //cout d'achat du produit 
                produit.cout = (1-Math.pow(produit.croissance, args.quantite + 1))/(1-produit.croissance)
                console.log(produit.cout)

                //capital, montant contenu dans le porte-monnaie
                context.world.money = context.world.money - produit.cout 
                console.log(context.world.money)
                //mise à jour du cout du produit
                let nouveauPrix = produit.cout * Math.pow(produit.croissance, args.quantite);
                console.log(nouveauPrix)

            }saveWorld(context)
        
         return produit
        },
       

        lancerProductionProduit(parent, args, context) {
            let produit = context.world.products.find(p => p.id === args.id)
            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.timeLeft = produit.vitesse
            }saveWorld(context)
        },

        engagerManager(parent,args,context){
context.world.managers
        }
    }
};

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(`Erreur d'écriture du monde coté serveur`)
            }
        })
}
