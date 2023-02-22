import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';

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

 

  /*const na=Math.floor(Math.random() * 10000);
  const pseudoInitial="Artiste";

  const [username, setUsername] = useState(pseudoInitial+na);*/

 
 
  const [username, setUsername] = useState("")
  const client = useApolloClient();


  useEffect(() => {
    let lusername = localStorage.getItem("username");
    if (lusername===undefined) {
      lusername="Artiste " + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", lusername);
    }
    if (lusername!==null) setUsername(lusername);
  }, []);



  const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
   
    localStorage.setItem("username", event.currentTarget.value);
    setUsername(event.currentTarget.value);

    client.resetStore()
    //console.log(na);

  };

  const {loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
   });


  
  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps =  <Main loadworld={data.getWorld} username={username} />  

   

  return (
    <div>
    <div> Your ID : </div>
    <input type="text" value={username} onChange={onUserNameChanged}/>
    { corps }
    </div> 
   
  );
}

export default App;
