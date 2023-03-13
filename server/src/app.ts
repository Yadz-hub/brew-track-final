import express, { Request, Response, Router } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send({ "users": ["user1", "user2", "user3"] });
});

app.listen("5001", ()=>{
    console.log("server listening to your soul on port 5001");
    
})
