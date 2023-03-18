import { useRef, useState } from "react";
import { useInterval } from "./MyInterval";
import MyProgressbar, { Orientation } from "./MyProgressbar"
import { Product } from "./world"



type ProductProps = {
    product: Product,
    onProductionDone: (product: Product, qt: number) => void,
    onProductBuy: (product: Product) => void,
    money: number,
    qtmulti: String

}
export default function ProductComponent({ product, onProductionDone, onProductBuy, money, qtmulti }: ProductProps) {
    
    const lastupdate = useRef(Date.now()); 
    const [showProgressBar, setShowProgressBar] = useState(false);
    let [timeleft, setTimeleft] = useState(product.timeleft);

    //product.lastupdate = Date.now();
    //const [run, setRun] = useState(false);

    function startFabrication() {
        setTimeleft(product.vitesse);
       // lastupdate.current = Date.now();
        setShowProgressBar(true);
        console.log("production on ");
       // onProductBuy(product);
    }

    //fonction de la suite géométrique
    function calcMaxCanBuy() {
        const currentCost = product.cout * (1 + product.croissance) ** product.quantite; //le coût actuel de l'achat d'une unité supplémentair
        //calcule le nombre maximal d'unités qu'un utilisateur peut acheter 
        const maxCanBuy = Math.floor(
          Math.log((money * (product.croissance + 1)) / currentCost + 1) / Math.log(product.croissance + 1))
    }



    function scalcScore1() {
        let nbProduction = 0;
        const now = Date.now();
        const tempsEcoule = now - lastupdate.current; // temps écoulé depuis la dernière mise à jour du score
        lastupdate.current = now; // on remet à jour lastupdate

        if (timeleft === 0) {
            setShowProgressBar(false);
            return; // produit pas en cours de production, on ne fait rien
        }

        if (product.managerUnlocked) {
            console.log("débloqué");
            if (timeleft > 0) {
                const tempsEcouleProduit = tempsEcoule - timeleft
                if (tempsEcouleProduit < 0) timeleft -= tempsEcoule
                else {

                    nbProduction = tempsEcouleProduit / product.vitesse + 1
                    setTimeleft(tempsEcouleProduit % product.vitesse)
                }
                
            } else {
                
                
                timeleft -= tempsEcoule
                if (timeleft <= 0) {
                    nbProduction = 1
                    setTimeleft(0)
                    //setShowProgressBar(false);
                }

            }
        } else {
            /*timeleft -= tempsEcoule
                if (timeleft <= 0 && timeleft < tempsEcoule) {
                    nbProduction = 1
                    setTimeleft(0)
                    //setShowProgressBar(false);
                    console.log("test passe par la ");
                }
                console.log(timeleft);

            if (timeleft == 0) {
                console.log("test2 passe par la ")
                setShowProgressBar(false)
                setTimeleft(0)
                
            }*/


            // modification du Prof pour le beug de la progressbar 

            timeleft -= tempsEcoule
                if (timeleft <= 0) {
                    nbProduction = 1
                    setTimeleft(0)
                    //onProductionDone(product, nbProduction) 
                    console.log("test  blabliblou ");
                }
        }

        if (nbProduction > 0) {
            onProductionDone(product, nbProduction)
        }

        lastupdate.current = Date.now()
   
    }



    function scalcScore() {
        let nbProduction = 0;
        let tempsEcoule = Date.now() - lastupdate.current
        lastupdate.current = Date.now(); 

        if (product.managerUnlocked) {
            setTimeleft(product.vitesse)
            if (timeleft === 0) {
                return;
            }
            if (tempsEcoule < timeleft) {
                let newTimeLeft = timeleft - tempsEcoule
                setTimeleft(newTimeLeft)
            } else {
                setTimeleft(0)
                nbProduction=1
                onProductionDone(product, nbProduction) 
            }

        }else{

            if (timeleft === 0) {
                return; 
            }

            if(tempsEcoule < timeleft){
                let newTimeLeft = timeleft - tempsEcoule
                setTimeleft(newTimeLeft)
            }else{
                setTimeleft(0)
                nbProduction=1
                onProductionDone(product, nbProduction)
            }
        }
    }
    
    useInterval(() => scalcScore(), 100);


    return (
        <div className="produit" >
            <div className="lesdeux">
                <div className="lepremier">
                    <img onClick={startFabrication} src={"http://localhost:4000/" + product.logo} />
                </div>
                <div className="lesecond">
                    <span className="productName"> {product.name}</span>
                    <span className="producQuantity"> qt : {product.quantite} </span>
                    <button className="achetezmoi" onClick={() =>onProductBuy(product)} disabled={money < product.cout}>Buy :{qtmulti}</button>
                  
                    <div className="price"> price: {product.cout} $</div>
                </div>
            </div>

            {showProgressBar && ( 
            <MyProgressbar 
            className="barstyle" 
            vitesse={product.vitesse}
            initialvalue={product.vitesse - timeleft}
            run={timeleft > 0 || product.managerUnlocked } 
            frontcolor="#8B4513" // marron
            backcolor="#ffffff"
            auto={product.managerUnlocked}
            orientation={Orientation.horizontal} />)}
        </div>

    )
}