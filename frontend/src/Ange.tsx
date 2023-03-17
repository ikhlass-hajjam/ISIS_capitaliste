import { World, Palier } from "./world";
import React, { useState } from 'react';
import {Snackbar, Alert} from "@mui/material";


type AngeProps = {
    loadworld : World,
    buyAnge: (angel: Palier) => void,
    handleAnge: () => void,
    showAnges:Boolean
    ange: number,
    //angelupgrades: Palier

}

export default function AngeComponent({loadworld, buyAnge, handleAnge, showAnges,ange}:AngeProps) {
   

    const [world,setWorld] = useState(loadworld)
    // pour les notifications alert 
    const [snackBarAnge, setSnackBarAnge] = useState(false);
    const [actualAnge, setSnackActualAnge] = useState(world.angelupgrades[0]);

    function handleClickAnge(ange:Palier){
        setSnackBarAnge(true)
        buyAnge(ange)
        setSnackActualAnge(ange)
    }


    return (
        <div className="Ange" >
            <div>
                {showAnges &&
                    <div className="modal">
                        <div>
                            <h1 className="title">
                            "No improvement without sacrifice" 
                            <h6 className="title">These improvements cost angels!
                            <button className="close" onClick={() => handleAnge()}>Close</button>
                            </h6>
                            </h1>
                            
                        </div>
                        <div>
                            {
                                world.angelupgrades.filter((ange: Palier) => !ange.unlocked).map(
                                    (ange: Palier) => {
                        
                                        return (
                                            <div key={ange.idcible} className="managergrid">
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + ange.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{ange.name}</div>
                                        
                                                    <div className="managercost">{ange.seuil}</div>
                                                </div>
                                                <div onClick={() => handleClickAnge(ange)}>
                                                    <button className= "hireButton"> Buy with your angels! </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            }
                            
                        </div>

                        <div>
                            <Snackbar open={snackBarAnge} autoHideDuration={3000} onClose={() => setSnackBarAnge(false)}>
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    <img className="petitRound" src={"http://localhost:4000/" + actualAnge.logo}/>
                                    Vous venez de faire un placement de produit {actualAnge.name}
                                </Alert>
                          </Snackbar>
                        </div>   


                    </div>
                }
            </div>
        </div>
    );
}


