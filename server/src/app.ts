import express, { Request, Response, Router } from "express";
import axios, { AxiosResponse } from "axios";
import UserModel from "./models/UserModel";
import bcrypt from 'bcrypt';
const cors = require('cors');
const bodyParser = require('body-parser');





const app = express();
app.use(bodyParser.json());
app.use(cors());

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

let brewData: BreweryDetails[] = [];

const API_KEY = process.env.API_KEY;

app.get("/api", async (req: Request, res: Response) => {
  const city = "san_diego";
  const url = `https://api.openbrewerydb.org/breweries?by_city=${city}`;

  try {
    const response: AxiosResponse<BreweryDetails[]> = await axios.get(url);
    const data = response.data;

    if (
      Array.isArray(data) &&
      data.every(
        (item: BreweryDetails) => typeof item === "object" && item !== null
      )
    ) {
      brewData = data;
      try {
        await axios.get("http://localhost:5001/api/temperature"); // This will update brewData
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching temperature data" });
      }
      res.send(brewData);
    } else {
      throw new Error("Invalid data format");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching breweries" });
  }
});

app.get("/api/temperature", async (req: Request, res: Response) => {
  try {
    for (const brewery of brewData) {
      const { longitude, latitude } = brewery;
      const url = `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=airTemperature`;
      const headers = { Authorization: API_KEY };
      const response: AxiosResponse<any> = await axios.get(url, { headers });

      const data = response.data;

      const currentTemperature =
        data?.hours?.[0]?.airTemperature?.[0]?.value ?? "N/A";

      brewery.degreesCelcius = currentTemperature;
    }

    res.send(brewData);
  } catch (error) {
    console.error(error + ' Error fetching temperature data');
    res.send(brewData);
  }
});

const saltRounds = 10;
const plainTextPassword = 'myPassword123';

app.post("/api/user", async (req: Request, res: Response) => {
  const user = req.body;

  try {
    // check if user already exists
    const existingUser = await UserModel.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).send("User with this email already exists");
    }

    // generate salt and hash password
    const saltRounds = 10;
    const plainTextPassword = user.password;
    bcrypt.hash(plainTextPassword, saltRounds, async (err: Error, hash:string) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving user");
      }

      // save hash to database
      user.password = hash;
      const savedUser = await UserModel.create(user);
      console.log("---user saved ", savedUser);
      res.status(200).send("User saved successfully");
    });
  } catch (error) {
    console.error(error, " Error saving user");
    res.status(500).send("Error saving user");
  }
});


// compare hash with plain text password
const hashFromDatabase = '$2b$10$A1bEih9XrZq3fDTdPRfHNOVGiV4N4gq3lxV.lI4Bk4cNAbX5S5Wy';
bcrypt.compare(plainTextPassword, hashFromDatabase, (err: Error, result: boolean) => {
  if (err) {
    console.error(err);
  } else if (result) {
    console.log('Passwords match');
  } else {
    console.log('Passwords do not match');
  }
});

app.listen("5001", () => {
  console.log("server listening to your soul on port 5001 :)");
});
