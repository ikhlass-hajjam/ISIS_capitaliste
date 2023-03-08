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
            scaleScore(parent, args, context)
            let produit = context.world.products.find(p => p.id === args.id)
            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                //augmentation de la quantité de produit
                produit.quantite = produit.quantite + args.quantite
                console.log(produit.quantite)

                //cout d'achat du produit 
                let PrixAchat = (Math.pow(produit.croissance, args.quantite )-1)/( produit.croissance -1)*produit.cout
                console.log(PrixAchat)

                //capital, montant contenu dans le porte-monnaie
                context.world.money = context.world.money - PrixAchat
                console.log(context.world.money)
                //mise à jour du cout du produit
                produit.cout = produit.cout * Math.pow(produit.croissance, args.quantite)
                console.log(produit.cout)
                context.world.lastupdate = Date.now()
            } saveWorld(context)

            return produit
        },


        lancerProductionProduit(parent, args, context) {
            scaleScore(parent, args, context)
            let produit = context.world.products.find(p => p.id === args.id)
            if (produit === undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.timeLeft = produit.vitesse
                context.world.lastupdate = Date.now()
            } saveWorld(context)
        },

        engagerManager(parent, args, context) {
            scaleScore(parent, args, context)
            let manager = context.world.managers.find(m => m.name === args.name)
            if (manager === undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                //débloquer le manager en passant les propriétés à vrai
                managerUnlocked = true;
                unlocked = true;
                context.world.lastupdate = Date.now()
                
            } saveWorld(context)
            return manager
        }
    },
    
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
function scaleScore(parent, args, context) {
    context.world.products.forEach(function (p) {
        let nbreProduction = 0;
        let tempsEcoule = Date.now() - context.world.lastupdate;
        //Manager débloqué
        if (p.managerUnlocked) {
            //Combien de produit on été fait pendant le temps écoulé
            nbreProduction = tempsEcoule / p.vitesse
            //Pour savoir le temps restant pour produit une autre unité
            Reste = tempsEcoule % p.vitesse
            
            if (p.timeLeft - tempsEcoule > 0) {
                nouveauTempsRestant = p.timeLeft + Reste
                p.quantite += nbreProduction
            }

        } else {
            //production d'un produit sans manager (pas automatisé) mais qu'on lance la production
            if (p.timeLeft > 0) {
                p.timeLeft -= tempsEcoule
                p.quantite = p.quantite + 1
            } else {
                p.timeLeft = 0;
            }

        }
        context.world.money += nbreProduction * p.revenu * p.quantite
    }

    );
}
