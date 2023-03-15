import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './style.css';
import './App.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';

import ProductComponent from './Product';



const GET_WORLD = gql`
 query getWorld {
    getWorld {
      name
      logo
      money
      score
      totalangels
      activeangels
      angelbonus
      lastupdate
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`



function App() {
 
  const client = useApolloClient();
  //let world= require("./world")



    let lusername = localStorage.getItem("username");
    if (lusername === undefined) {
      lusername = "Artiste " + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", lusername);
    }
    if (!lusername) lusername = ""
     


    const [username, setUsername] = useState(lusername)

    const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {

    localStorage.setItem("username", event.currentTarget.value);
    setUsername(event.currentTarget.value);
    client.resetStore()
    //console.log(event.currentTarget.value);

  };
  

  // averifier pourquoi j'ai un lastupdate ici 
  const lastUpdate = useRef(Date.now());

  
  const { loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
  });



  console.log("loading:", loading);
  console.log("error:", error);
  console.log("data:", data);

  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps = <Main loadworld={data.getWorld} username={username} />




  // c la meme variable n ==> logarithme , U0= wordl.money, q0 ets le taux de croissance, 

  return (
    <div className='MarloupeApp'>
      <div> Your ID : </div>
      <input type="text" value={username} onChange={onUserNameChanged} />
      {corps}
      
    </div>

  );

}

export default App; 
