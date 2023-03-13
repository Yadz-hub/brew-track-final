import React, {useEffect, useState} from 'react';

function App() {


  interface BackendData {
    users: string[];
  }
  

  const [backEndData, setBackEndData] = useState<BackendData>()

  useEffect(()=>{
    fetch("/api").then((response)=>{
      response.json().then((data)=>{
        console.log(data);
        
        setBackEndData(data)
      })
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        {(typeof backEndData?.users === "undefined") ? (<p>Loading</p>) : backEndData.users.map((user, i)=>{
          return <p key={i}>{user}</p>
        })}
      </header>
    </div>
  );
}

export default App;
