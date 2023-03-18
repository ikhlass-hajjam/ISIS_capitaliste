import { useEffect, useState } from "react"
import ProductComponent from "./Product"
import { World } from "./world"
import { transform } from "./utils";
import { Product } from './world';
import { Palier } from './world';
import ManagerComponent from "./Managers";
import UpgradeComponent from "./Upgrades";
import AngeComponent from "./Ange";
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {Snackbar, Alert, Button} from "@mui/material";



// ici on appelle les mutations pour lier avec le serverur ==> le backend ==> on fait des requetes 
const ACHETER_PRODUIT = gql`
    mutation acheterQtProduit($id: Int!, $quantite: Int!) {
        acheterQtProduit(id: $id, quantite: $quantite) {
            id
        }
    }
`;

const ENGAGER_MANAGER = gql`
    mutation engagerManager($name: String!) {
      engagerManager(name: $name) {
            name
        }
    }
`;

const ANGE_UPGRADE = gql`
    mutation acheterAngelUpgrade($name: String!) {
      acheterAngelUpgrade(name: $name) {
            name
        }
    }
`;

const CASH_UPGRADE = gql`
    mutation acheterCashUpgrade($name: String!) {
      acheterCashUpgrade(name: $name) {
            name
        }
    }
`;

const RESET_WORLD = gql`
    mutation resetWorld {
      resetWorld {
        name
        }
    }
`;







type MainProps = {
  loadworld: World
  username: string
}

export default function Main({ loadworld, username }: MainProps) {
  const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
  useEffect(() => {
    setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
  }, [loadworld])





  const [acheterProduit] = useMutation(ACHETER_PRODUIT,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        
      }
    }
  )

  const [acheterAngelUpgrade] = useMutation(ANGE_UPGRADE,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
       
      }
    }
  )

  const [engagerManager] = useMutation(ENGAGER_MANAGER,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
       
      }
    }
  )

  const [acheterCashUpgrade] = useMutation(CASH_UPGRADE,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        
      }
    }
  )

  const [newWorld] = useMutation(RESET_WORLD,
    {
      context: { headers: { "x-user": username } },
      onError: (error): void => {
        
      }
    }
  )



  
  const [money, setMoney] = useState(world.money);
  const [ange, setAnge] = useState(world.activeangels);
  const [qtmulti, setQtmulti] = useState("x1");
  const [showManagers, setShowManagers] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showAnges, setShowAnges] = useState(false);
  const [score, setScore] = useState(world.score);
  const [bonusAnge, setBonusAnge] = useState(world.angelbonus);
  const [snackBarUnlocks, setSnackBarUnlocks] = useState(false);
  const [snackBarAllUnlocks, setSnackBarAllUnlocks] = useState(false);
  const [actualUnlocks, setActualUnlocks] = useState(world.allunlocks[0]);
  const [actualAllUnlocks, setActualAllUnlocks] = useState(world.allunlocks[0]);
  const [snackBarReset, setSnackBarReset] = useState(false);
  const [resetAnge, setResetAnge] = useState(0);

  function onProductionDone(p: Product): void {
    let gain =  p.revenu * p.quantite; // le gain du nombre de produits générés depuis la dernière mise à jour
    let newScore = score + gain
    let newMoney = money + gain
    setScore(newScore)
    setMoney(newMoney)
  }


  // pour engager les managers 
  function hireManager(manager: Palier): void {
    manager.unlocked = true;
    let produit = world.products.find(p => p.id === manager.idcible)
    if (produit === undefined) {
        throw new Error(
            `Le produit avec l'id ${manager.idcible} n'existe pas`)
    } else {
        produit.managerUnlocked = true
        let newMoney = money - manager.seuil      
        setMoney(newMoney)      
    }
    engagerManager({ variables: { name: manager.name } });
  }


  //fonction acheter les upgrades
  function buyUpgrade(upgrade: Palier): void {
    upgrade.unlocked = true;
    let newMoney = money - upgrade.seuil
    setMoney(newMoney)

    let produit = world.products.find(p => p.id === upgrade.idcible)

    if (produit === undefined) {
        throw new Error(
            `Le produit avec l'id ${upgrade.idcible} n'existe pas`)
    } else {
        if (upgrade.typeratio == "vitesse") {
            produit.vitesse = Math.round(produit.vitesse / upgrade.ratio)
            console.log("vitesse plus vite")
        }
        if (upgrade.typeratio == "gain") {
            produit.revenu = produit.revenu * upgrade.ratio
            console.log("argent++")

        }
      } 
      
      acheterCashUpgrade({ variables: { name: upgrade.name } });


  }



  // focntion pour acheter les anges 
  function buyAnge(angel: Palier): void {
    angel.unlocked = true
    let newAnge = ange - angel.seuil
    setAnge(newAnge)

    if (angel.typeratio == "ange") {
        world.angelbonus += angel.ratio
    } else {
        world.products.forEach(produit => {

            if (angel.typeratio == "vitesse") {
                produit.vitesse = Math.round(produit.vitesse / angel.ratio)
            }
            if (angel.typeratio == "gain") {
                produit.revenu = produit.revenu * angel.ratio
            }

        })
      }
      acheterAngelUpgrade({ variables: { name: angel.name } });
  }
  


// fonction  de reset world
function resetWorld() {
  newWorld({ variables: {} });
  window.location.reload();
}

  // l'affichage des boutons des managers et compagnie 
  function handleManager(){
    setShowManagers(!showManagers)
  }
  function handleUpgrade(){
    setShowUpgrades(!showUpgrades)
  }
  function handleAnge(){
    setShowAnges(!showAnges)
  }


  // fonction onProductBuy 

  function onProductBuy(p: Product) {
    let lastQuantite = p.quantite

    if(money >= p.cout){
      if(qtmulti==="x1"){
        p.quantite += 1
        let moneyWorld = money - ((Math.pow(p.croissance, 1) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 1)
        setMoney(moneyWorld)

        console.log("ikhlasss achat ");
        acheterProduit({ variables: { id: p.id, quantite: 1 } });
      }
      if(qtmulti==="x10"){
        p.quantite += 10
        let moneyWorld = money - ((Math.pow(p.croissance, 10) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 10)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: 10 } });
      }
      if(qtmulti==="x100"){
        p.quantite += 100
        let moneyWorld = money - ((Math.pow(p.croissance, 100) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, 100)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: 100 } });
      }

      if (qtmulti === "Max"){
        // ==> pour calculer le nombre maximum de multimplicateur qu'on peut acheter 
        let maxCanBuy = Math.floor((Math.log10(((money * (p.croissance - 1))/p.cout) + 1))/Math.log10(p.croissance))
        p.quantite += maxCanBuy
        let moneyWorld = money - ((Math.pow(p.croissance, maxCanBuy) - 1) / (p.croissance - 1) * p.cout)
        p.cout = p.cout * Math.pow(p.croissance, maxCanBuy)
        setMoney(moneyWorld)
        acheterProduit({ variables: { id: p.id, quantite: maxCanBuy } });
      }
    }
    p.paliers.forEach(u => {
      if (u.idcible === p.id && p.quantite >= u.seuil && lastQuantite<u.seuil) {
        u.unlocked = true
        setActualUnlocks(u)
        setSnackBarUnlocks(true)
        
        if (u.typeratio === "vitesse") {
          p.vitesse = Math.round(p.vitesse / u.ratio)
        }
        if (u.typeratio === "gain") {
          p.revenu = p.revenu * u.ratio
        }
        if (u.typeratio === "ange") {
          world.angelbonus += u.ratio
        }
      }
    })
      world.allunlocks.forEach(a => {
        if (p.quantite >= a.seuil && lastQuantite<a.seuil) {
          let allunlocks = true
          world.products.forEach(p => {
            if (p.quantite < a.seuil) {
              allunlocks = false
            }
          })
          if (allunlocks) {
            a.unlocked = true
            setActualAllUnlocks(a)
            setSnackBarAllUnlocks(true)
            if (a.typeratio === "ange") {
              world.angelbonus += a.ratio
            } else {
              let produitCible = world.products.find(p => p.id === a.idcible)
  
              if (produitCible === undefined) {
                throw new Error(
                  `Le produit avec l'id ${a.idcible} n'existe pas`)
              } else {
                if (a.typeratio === "vitesse") {
                  produitCible.vitesse = Math.round(produitCible.vitesse / a.ratio)
                }
                if (a.typeratio === "gain") {
                  produitCible.revenu = Math.round(produitCible.revenu * a.ratio)
                }
              }
            }
          }
        }
      })
  
}




  // ==> pour changer le truc de multiplicateur en changeant l'état  
  function handleChange() {
    if(qtmulti==="x1"){setQtmulti("x10");}
    if(qtmulti==="x10"){setQtmulti("x100");}
    if(qtmulti==="x100"){setQtmulti("Max");}
    if(qtmulti==="Max"){setQtmulti("x1");}
  }

  // la methode clickReset ==> pour le snack barre, et affihcer le nombre d'ange quon va gagner
  
  function clickReset(){
    setSnackBarReset(true)
    let calculAnge = Math.round(150 * Math.sqrt(score / Math.pow(10, 10))) - world.totalangels
    setResetAnge(calculAnge)
  }


  return (
    <div className="App">
      {/**le header  */}
      <div className="header">
        <div> <img className="square" src={"http://localhost:4000/" + world.logo} /> </div>
        <span className="worldName"> {world.name} </span>
        <div className="scoreMl">
          <div className="textML"> MarloupeMoney </div>
          <span dangerouslySetInnerHTML={{ __html: transform(money)}}/>
          <div className="textAngels">angels : </div>
          <span dangerouslySetInnerHTML={{ __html: transform(ange)}}/>
          <div className="textScore">score : </div>
          <span dangerouslySetInnerHTML={{ __html: transform(score)}}/>
          <div className="textScore">bonusAnge : </div>
          <span dangerouslySetInnerHTML={{ __html: transform(bonusAnge)}}/>
        </div>
      </div>

        <div> 
          <button className="qultimultiButton"onClick={() => handleChange()}>multiply the purchase of your products : {qtmulti} !</button>
        </div>

      <div className="main">
        
        <div className="titreMenu"> Table service
        {/**les bouttons des managers et compagnie... */}
          <div className="bouttonsMenus">
            <br></br><button className="bouttonManagers" onClick={() => handleManager()}>Managers </button>
            {showManagers && <ManagerComponent loadworld={world} hireManager={hireManager} handleManager={handleManager} showManagers={showManagers} money={money}/>}
            <br></br><button className="bouttonUpgrades" onClick={() => handleUpgrade()} > CashUpgrades</button>
            {showUpgrades && <UpgradeComponent loadworld={world} buyUpgrade={buyUpgrade} handleUpgrade={handleUpgrade} showUpgrades={showUpgrades} money={money}/>}
            <br></br><button className="bouttonAnges" onClick={() => handleAnge()} >show Angels</button>
            {showAnges && <AngeComponent loadworld={world} buyAnge={buyAnge} handleAnge={handleAnge} showAnges={showAnges} ange={ange}/>}

            <button className="rimage" id="reset-world" onClick={() => clickReset()} disabled={(Math.round(150 * Math.sqrt(score / Math.pow(10, 10))) - world.totalangels)<0}>
            </button>


          </div>



        <div>
          {
            world.allunlocks.filter((allunlock: Palier) => allunlock.unlocked).map(
                (allunlock: Palier) => {
                  return (
                      <div key={allunlock.seuil} className="managergrid">
                          <div>
                              <div className="logo">
                                <img className="round" src={"http://localhost:4000/" + allunlock.logo}/>
                              </div>
                          </div>
                          <div className="infosmanager">
                              <div className="managername">{allunlock.name}</div>
                          </div>
                      </div>
                  );
                }
            )
          }
        </div>
        
        </div>

        <div className="product">
          
          {/** les six produits*/}
          <div className="product">
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[0]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[1]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[2]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[3]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[4]} money={money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} qtmulti={qtmulti} product={world.products[5]} money={money} />
          </div>

        </div>
      </div>

      <div className="SnackBar">
        <Snackbar open={snackBarUnlocks} autoHideDuration={3000} onClose={() => setSnackBarUnlocks(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            <img className="petitRound" src={"http://localhost:4000/" + actualUnlocks.logo}/>
            Vous avez {actualUnlocks.name} !
          </Alert>
        </Snackbar>
      </div>
          {/**snackbar pour les unlocks */}
      <div className="SnackBar">
        <Snackbar open={snackBarAllUnlocks} autoHideDuration={3000} onClose={() => setSnackBarAllUnlocks(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            <img className="petitRound" src={"http://localhost:4000/" + actualAllUnlocks.logo}/>
            Vous avez {actualAllUnlocks.name} !
          </Alert>
        </Snackbar>
      </div>
          {/**snackbar pour le reset */}
      <div className="SnackBar">
        <Snackbar open={snackBarReset} autoHideDuration={10000} onClose={() => setSnackBarReset(false)}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Es-tu sûr de vouloir reset ton Marloupe ? Avec {resetAnge} anges 
            <Button onClick={() => resetWorld()}>Yes</Button>
          </Alert>
        </Snackbar>
      </div>

    </div>
    
  )
}
