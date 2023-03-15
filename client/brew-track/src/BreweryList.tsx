import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import React, { ReactElement, useState } from "react";

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

interface Props {
  breweries: BreweryDetails[];
}

function BreweryList({ breweries }: Props): ReactElement {
  const [numToShow, setNumToShow] = useState(10);

  const handleShowMore = () => {
    setNumToShow(numToShow + 10);
  };

  const visibleBreweries = breweries.slice(0, numToShow);

  return (
    <>
      <Grid container spacing={2}>
        {visibleBreweries.map((brewery) => (
          <Grid key={brewery.id} item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {brewery.breweryName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {brewery.street}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {brewery.city}, {brewery.state} {brewery.postal_code}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Phone: {brewery.phone}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Temperature: {brewery.degreesCelcius ? brewery.degreesCelcius + ' Degrees Celcius': 'No Temperature data for this brewery - Sorry :('} 
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Website:{" "}
                  <a
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {brewery.website_url}
                  </a>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {numToShow < breweries.length && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleShowMore}>
            Show More
          </Button>
        </Box>
      )}
    </>
  );
}

export default BreweryList;
