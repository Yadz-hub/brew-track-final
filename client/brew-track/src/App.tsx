import React, { useEffect, useState } from "react";
import BreweryList from "./BreweryList";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserForm from "./UserForm";

function App() {
  interface BreweryDetails {
    id: number;
    breweryName: string;
    breweryType: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    longitude: string;
    latitude: string;
    phone: string;
    website_url: string;
    updated_at: string;
    tag_list: [];
    degreesCelcius: string;
  }

  interface UserDetails {
    firstName: string,
    lastName: string,
    email: string
  }

  const [breweryDetails, setBreweryDetails] = useState<BreweryDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDetailsCaptured, setUserDetailsCaptured] = useState(false);
  const [userData, setUserData] = useState<UserDetails>();

  const handleUserChange = async (userData:UserDetails) => {
    setUserData(userData);
    setUserDetailsCaptured(true);
    console.log('----userdata , ', userData);
    try {
      await fetch("http://localhost:5001/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error(error, " Error saving user");
    }
    
  };

  useEffect(() => {
    fetch("/api").then((response) => {
      response.json().then((data) => {
        if (Array.isArray(data)) {
          const breweryDetails: BreweryDetails[] = data.map(
            (item: BreweryDetails) => {
              return {
                id: item.id,
                breweryName: item.breweryName,
                breweryType: item.breweryType,
                street: item.street,
                city: item.city,
                state: item.state,
                postal_code: item.postal_code,
                country: item.country,
                longitude: item.longitude,
                latitude: item.latitude,
                phone: item.phone,
                website_url: item.website_url,
                updated_at: item.updated_at,
                tag_list: item.tag_list,
                degreesCelcius: item.degreesCelcius,
              };
            }
          );
          setBreweryDetails(breweryDetails);
          setLoading(false);
        }
      });
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>BrewTrack</h1>
        <p>Find your favorite brewpubs and their air temperature</p>
      </header>
      <main className="App-main">
        {!userDetailsCaptured ? (
          <UserForm onChange={handleUserChange} />
        ) : (
          <>
            {" "}
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <h2>Breweries:</h2>
                <BreweryList breweries={breweryDetails} />
              </>
            )}
          </>
        )}
      </main>
      <footer className="App-footer">
        <p>&copy; 2023 BrewTrack</p>
      </footer>
    </div>
  );
}

export default App;
