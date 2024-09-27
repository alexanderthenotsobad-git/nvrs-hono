import express from "express";


const app = express();
const PORT = 3000;

app.get("/", (req, res)=> {
    res.status(200).send("<h1>Welcome to ejs</h1>");
});

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
})