import { World, Palier } from "./world";
import React, { useState } from 'react';


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
                                                    <img className="round" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + upgrade.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                <div className="managername">{upgrade.name ? upgrade.name : "Undefined Name"}</div>
                                                  
                                                    <div className="managercible">
                                                        {world.products[upgrade.idcible - 1] && world.products[upgrade.idcible - 1].name}
                                                    </div>


                                                    <div className="Upgradecost">{upgrade.seuil}</div>
                                                </div>
                                                <div onClick={() => buyUpgrade(upgrade)}>
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
                    </div>
                }
            </div>
        </div>
    );
}