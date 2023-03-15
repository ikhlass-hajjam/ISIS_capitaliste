import { World, Palier } from "./world";
import React, { useState } from 'react';


type AngeProps = {
    loadworld : World,
    buyAnge: (angel: Palier) => void,
    handleAnge: () => void,
    showAnges:Boolean
    ange: number,
    angelupgrades: Palier

}

export default function AngeComponent({loadworld, buyAnge, handleAnge, showAnges,ange, angelupgrades}:AngeProps) {
   

    const [world,setWorld] = useState(loadworld)

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
                                                    <img className="round" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + ange.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{ange.name}</div>
                                                   
                                                    <div className="managercost">{ange.seuil}</div>
                                                </div>
                                                <div onClick={() => buyAnge(ange)}>
                                                    <button className= "hireButton">Capter les anges </button>
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


