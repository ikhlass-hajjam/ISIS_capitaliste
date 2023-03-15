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
    //let showManagers = false; // déclaration d'une variable booléenne showManagers à true

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
                                                    <img className="round" src={"https://isiscapitalistgraphql.kk.kurasawa.fr/" + manager.logo}/>
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















/*import { useState } from 'react';
import './ManagerStyle.css';
import { Palier } from './world';

type ManagerProps = {
    manager: Palier;
    
}

export default function Manager({ manager }: ManagerProps) {
    const [showManagers, setShowManagers] = useState(false);
    //let showManagers = true;
    let world = require("./world")

    function hireManager(palier:Palier):void{
        throw new Error ("Function not implmented. ")
    }

    function toggleModal() {
        setShowManagers(!showManagers);
    }


    return (

        <div>
            <button onClick={toggleModal}>Managers</button>
            {showManagers &&
                <div className="modal">

                    <div>
                        <h1 className="title">Managers make you feel better !</h1>
                    </div>
                    <div>{
                        world.managers.palier.filter((palier: Palier) => !palier.unlocked).map(
                            (palier: Palier) => {
                                <div key={manager.idcible} className="managergrid">
                                    <div>
                                        <div className="logo">
                                            <img alt="manager logo" className="round" src={ manager.logo} />
                                        </div>
                                    </div>
                                    <div className="infosmanager">
                                        <div className="managername">{manager.name}</div>
                                        <div className="managercible"> {world.products.product[manager.idcible - 1].name} </div>
                                        <div className="managercost">{manager.seuil}</div>
                                    </div>
                                    <div onClick={() => hireManager(manager)}>
                                        <button disabled={world.money < manager.seuil}>Hire !</button>

                                    </div>
                                </div>

                            }
                        )
                    }

                        <button className="closebutton" onClick={() => {toggleModal}}>Close</button>
                    </div>
                </div>
            }

        </div>




    );


}
*/