import express, { Request, Response, Router } from "express";
const app = express();

app.get("/api", (req: Request, res: Response) => {
  res.send({ "users": ["user1", "user2", "user3", "user4"] });
});

app.listen("5001", ()=>{
    console.log("server listening to your soul on port 5001");
    
})
