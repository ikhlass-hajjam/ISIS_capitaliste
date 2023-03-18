import { World, Palier } from "./world";
import React, { useState } from 'react';


type ManagerProps = {
    loadworld : World,
    hireManager: (manager: Palier) => void,
    handleManager: () => void,
    showManagers:Boolean
    money: number,

}

export default function ManagerComponent({loadworld, hireManager, handleManager, showManagers, money}:ManagerProps) {
     //let showManagers = true;

    const [world,setWorld] = useState(loadworld)

    return (
        <div className="manager" >
            <div>
                {showManagers &&
                    <div className="modal">
                        <div>
                            <h1 className="title">Managers make you feel better !
                            <button className="close" onClick={() => handleManager()}>Close</button>
                            </h1>
                        </div>
                        <div>
                            {
                                world.managers.filter((manager: Palier) => !manager.unlocked).map(
                                    (manager: Palier) => {
                        
                                        return (
                                            <div key={manager.idcible} className="managergrid">
                                                <div>
                                                    <div className="logo">
                                                    <img className="round" src={"http://localhost:4000/" + manager.logo}/>
                                                    </div>
                                                </div>
                                                <div className="infosmanager">
                                                    <div className="managername">{manager.name}</div>
                                                    <div className="managercible">
                                                        {world.products[manager.idcible - 1].name}
                                                    </div>
                                                    <div className="managercost">{manager.seuil}</div>
                                                </div>
                                                <div onClick={() => hireManager(manager)}>
                                                    <button className= "hireButton"disabled={money < manager.seuil}>Hire !</button>
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
