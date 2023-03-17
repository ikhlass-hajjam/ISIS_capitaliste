import { World, Palier } from "./world";
import React, { useState } from 'react';
import {Snackbar, Alert} from "@mui/material";


type UpgradeProps = {
    loadworld : World,
    buyUpgrade: (Upgrade: Palier) => void,
    handleUpgrade: () => void,
    showUpgrades:Boolean,
    money: number,
}

export default function UpgradeComponent({loadworld, buyUpgrade, handleUpgrade, showUpgrades, money}:UpgradeProps) {
    //let showUpgrades = false; // déclaration d'une variable booléenne showUpgrades à true

    const [world,setWorld] = useState(loadworld)
    const [snackBarUpgrade, setSnackBarUpgrade] = useState(false);
    const [actualUpgrade, setSnackActualUpgrade] = useState(world.upgrades[0]);


    function clickUpgrade(upgrade: Palier){
        setSnackBarUpgrade(true)
        buyUpgrade(upgrade)
        setSnackActualUpgrade(upgrade)
    }

    return (
        <div className="manager" >
            <div>
                {showUpgrades &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Cash upgrades
                            <button className="close" onClick={() => handleUpgrade()}>
                            Close 
                            </button>
                            </h1>
                        </div>
                        <div>
                            {
                                world.upgrades.filter((upgrade: Palier) => !upgrade.unlocked).map(
                                    (upgrade: Palier) => {
                        
                                        return (
                                            <div key={upgrade.name} className="managerAgrid">
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + upgrade.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                <div className="managername">{upgrade.name ? upgrade.name : "Undefined Name"}</div>
                                                  
                                                    <div className="managercible">boostez vos 
                                                         {world.products[upgrade.idcible - 1] && world.products[upgrade.idcible - 1].name}
                                                    </div>


                                                    <div className="Upgradecost">{upgrade.seuil}</div>
                                                </div>
                                                <div onClick={() => clickUpgrade(upgrade)}>
                                                    <button className="BuyUpgrade" disabled={money < upgrade.seuil}>
                                                        buyCashUpgrades
                                                    </button>
                                                   
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                )
                            }
                            
                        </div>

                    

                        <div className="SnackBar">
                            <Snackbar open={snackBarUpgrade} autoHideDuration={3000} onClose={() => setSnackBarUpgrade(false)}>
                                <Alert severity="success" sx={{ width: '100%' }}>
                                    <img className="petitRound" src={"http://localhost:4000/" + actualUpgrade.logo}/>
                                   Vous venez d'améliorer votre recette pour : <div>{actualUpgrade.name}</div> !
                                </Alert>
                          </Snackbar>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}