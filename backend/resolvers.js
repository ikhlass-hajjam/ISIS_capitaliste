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
                produit.cout = (1 - Math.pow(produit.croissance, args.quantite + 1)) / (1 - produit.croissance)
                console.log(produit.cout)

                //capital, montant contenu dans le porte-monnaie
                context.world.money = context.world.money - produit.cout
                console.log(context.world.money)
                //mise à jour du cout du produit
                let nouveauPrix = produit.cout * Math.pow(produit.croissance, args.quantite);
                console.log(nouveauPrix)
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
            let manager = context.world.managers.find(m => m.id === args.id)
            if (manager === undefined) {
                throw new Error(`Le manager avec l'id ${args.id} n'existe pas`)
            } else {
                //débloquer le manager en passant les proprétés à vrai
                managerUnlock = true;
                unlocked = true;
                context.world.lastupdate = Date.now()
            } saveWorld(context)
        }
    },
    scaleScore(parent, args, context) {
        world.context.products.forEach(function (p) {
            let nbreProduction = 0;
            let tempsEcoule = Date.now() - context.world.lastupdate;
            //Manager débloqué
            if (p.managerUnlock) {
                //Combien de produit on été fait pendant le temps écoulé
                nbreProduction = tempsEcoule / produit.vitesse
                //Pour savoir le temps restant pour produit une autre unité
                Reste = tempsEcoule % produit.vitesse
                
                if (p.timeLeft - tempsEcoule > 0) {
                    nouveauTempsRestant = p.timeLeft + Reste
                    produit.quantite += nbreProduction
                }

            } else {
                //production d'un produit sans manager (pas automatisé) mais qu'on lance la production
                if (p.timeLeft > 0) {
                    p.timeLeft -= tempsEcoule
                    produit.quantite = produit.quantite + 1
                } else {
                    p.timeLeft = 0;
                }

            }
            context.world.money += nbreProduction * produit.revenu
        }

        );
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
