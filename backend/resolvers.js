const { money } = require("./world");

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
                let PrixAchat = (Math.pow(produit.croissance, args.quantite) - 1) / (produit.croissance - 1) * produit.cout
                console.log(PrixAchat)

                //capital, montant contenu dans le porte-monnaie
                context.world.money = context.world.money - PrixAchat
                console.log(context.world.money)
                //mise à jour du cout du produit
                produit.cout = produit.cout * Math.pow(produit.croissance, args.quantite)
                console.log(produit.cout)

                //gain de revenu en fonction de la quantité de produit acheté
                produit.revenu = produit.revenu * args.quantite
                context.world.lastupdate = Date.now()

                //Acheter les upgrades si le seuil du produit a été atteint 
                if (context.world.upgrades > context.world.seuil) {
                    acheterCashUpgrade
                }
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
            return produit
        },

        engagerManager(parent, args, context) {
            scaleScore(parent, args, context)
            let manager = context.world.managers.find(m => m.name === args.name)
            console.log(manager.idcible)
            let produit = context.world.products.find(p => p.id === manager.idcible)
            if (manager === undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                //débloquer le manager en passant les propriétés à vrai
                manager.unlocked = true;
                produit.managerUnlocked = true;
                context.world.lastupdate = Date.now()

                saveWorld(context)

            } return manager
        },

        acheterCashUpgrade(parent, args, context) {
            scaleScore(parent, args, context)
            let upgrade = context.world.upgrades.find(u => u.name === args.name);
            // Parcourt les produits pour multiplier leur revenu par le facteur de ratio de l'upgrade

            if (upgrade === undefined) {
                throw new Error(`L'upgrade ${args.name} n'existe pas`)
            } else {
                upgrade.unlocked = true;
                //mise à jour du porte-monnaie
                context.world.money = context.world.money - upgrade.seuil
                let produit = context.world.products.find(p => p.id === upgrade.idcible);
                if (produit === undefined) {
                    throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
                } else {
                    //augmentation du revenu du produit (upgrade de type gain)
                    if (upgrade.typeratio == "gain") {
                        produit.revenu = produit.revenu * upgrade.ratio
                    }
                    //augmentation de la vitesse de production du produit(upgrade de type vitesse)
                    if (upgrade.typeratio == "vitesse") {
                        produit.vitesse = produit.vitesse * upgrade.ratio
                    }
                }
            } saveWorld(context)
            return upgrade
        },
        acheterAngelUpgrade(parent, args, context) {
            scaleScore(parent, args, context)
            let angelUpgrade = context.world.angelupgrades.find(angelUp => angelUp.name === args.name)

            if (angelUpgrade === undefined) {
                throw new Error(
                    `Le angelUpgrade avec le nom ${args.name} n'existe pas`)
            } else {
                angelUpgrade.unlocked = true

                if (angelUpgrade.typeratio == "ange") {
                    context.world.angelbonus += angelUpgrade.ratio
                } else {
                    context.world.products.forEach(produit => {

                        if (angelUpgrade.typeratio == "vitesse") {
                            produit.vitesse = Math.round(produit.vitesse / angelUpgrade.ratio)
                        }
                        if (angelUpgrade.typeratio == "gain") {
                            produit.revenu = produit.revenu * angelUpgrade.ratio
                        }

                    })
                }
                context.world.activeangels -= angelUpgrade.seuil
                saveWorld(context)
                return angelUpgrade
            }
        },
        /* acheterAngelUpgrade(parent, args, context) {
             scaleScore(parent, args, context)
             let angelUpgrade = context.world.angelupgrades.find(ange => ange.name === args.name)
 
             if (angelUpgrade === undefined) {
                 throw new Error(`L'amélioration d'ange avec le nom ${args.name} n'existe pas.`);
             } else {
                 context.world.money -= angelUpgrade.seuil;
                 angelUpgrade.unlocked = true;
             
             if (angelUpgrade.typeratio === "ange") {
                 context.world.angelbonus = Math.round(p.vitesse / upgrade.ratio);
             }
             if (angelUpgrade.typeratio === "gain") {
                 p.revenu *= angelUpgrade.ratio;
             }
 
             if (angelUpgrade.typeratio === "vitesse") {
                 p.revenu = Math.round(p.vitesse / angelUpgrade.ratio);
             }
         }
             context.world.totalangels -= angelUpgrade.seuil
             
             saveWorld(context)
             return angelUpgrade
         },*/


        resetWorld(parent, args, context) {
            scaleScore(parent, args, context)
            
            if ((Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 10))) - context.world.totalangels)<0){
                context.world.activeangels += Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 10))) - context.world.totalangels
                context.world.totalangels = Math.round(150 * Math.sqrt(context.world.score / Math.pow(10, 10)))
            }
            //garder les anges qui ont été gagnés
            let totalangels = context.world.totalangels
            let activeangels = context.world.activeangels
            context.world.totalangels = totalangels
            context.world.activeangels = activeangels
            //réinitialisation l'argent du monde à sa valeur initiale 
            context.world.money = money
            //Réinitialisation pour les différents utlisateurs
            let world = require("./world")
            context.world = world
            //Réinitialisation de la quantité de produit à zéro
            let produit = context.world.products
            let QuantiteProduit = context.world.products
            QuantiteProduit = 0
            //Aucun manager débloqué à la réinitialisation du monde
            let managers = context.world.managers
            produit.managerUnlocked = false;
            managers.unlocked = false;
            
        
            saveWorld(context)
            return context.world
        },
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
};
function scaleScore(parent, args, context) {
    let tempsEcoule = Date.now() - context.world.lastupdate
    let nbProduction = 0

    for (p in context.world.products) {
        //production automatisée avec les managers
        if (p.managerUnlocked) {
            if (p.timeleft > 0) {
                Reste = temspEcoule - p.timeleft
                if (Reste < 0) {
                    p.timeleft -= tempsEcoule
                }
                else {
                    //Combien de produit on été fait pendant le temps écoulé
                    nbProduction = Reste / p.vitesse + 1
                    //Pour savoir le temps restant pour produit une autre unité dont la production a déja été entamé
                    p.timeleft = Reste % p.vitesse
                }
            } else {
                p.timeleft -= tempsEcoule
                if (p.timeleft <= 0) {
                    nbProduction = 1
                    p.timeleft = 0
                }
            }
            context.world.score = context.world.score + nbProduction * p.revenu * p.quantite
            context.world.money += nbreProduction * p.revenu * p.quantite
        }
        context.world.lastupdate = String(Date.now())
    }
};
/*function scaleScore(parent, args, context) {
    let nbProduction = 0
    let tempsEcoule = Date.now() - context.world.lastupdate;
    for (p in context.world.products) {

        if (p.managerUnlocked) {
            if (p.timeleft > 0) {
                tempsEcouleProduit = temspEcoule - p.timeleft
                if (tempsEcouleProduit < 0) p.timeleft -= tempsEcoule
                else {

                    nbProduction = tempsEcouleProduit / p.vitesse + 1
                    p.timeleft = tempsEcouleProduit % p.vitesse
                }
            } else {
                p.timeleft -= tempsEcoule
                if (p.timeleft <= 0) {
                    nbProduction = 1
                    p.timeleft = 0
                }
            }
            context.world.score = context.world.score + nbProduction * p.revenu * p.quantite
        }
        context.world.lastupdate = String(Date.now())
    }
};*/
/*function scaleScore(parent, args, context) {
    context.world.products.forEach(function (p) {
    let nbreProduction = 0;
    let tempsEcoule = Date.now() - context.world.lastupdate;
    //Manager débloqué
    if (p.managerUnlocked) {
        //Combien de produit on été fait pendant le temps écoulé
        nbreProduction = tempsEcoule / p.vitesse +1
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
let nbProduction = 0

for (p in context.world.products) {

    if (p.managerUnlocked) {
        if (p.timeleft > 0) {
            tempsEcouleProduit = temspEcoule - p.timeleft
            if (tempsEcouleProduit < 0) p.timeleft -= tempsEcoule
            else {

                nbProduction = tempsEcouleProduit / p.vitesse + 1
                p.timeleft = tempsEcouleProduit % p.vitesse
            }
        } else {
            p.timeleft -= tempsEcoule
            if (p.timeleft <= 0) {
                nbProduction = 1
                p.timeleft = 0
            }
        }
        context.world.score = context.world.score + nbProduction * p.revenu * p.quantite
    }
    lastupdate = String(Date.now())
}

}*/
