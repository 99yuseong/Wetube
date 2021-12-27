import express from "express";
import app from "./server";

const PORT = 3000;

app.listen(PORT, () =>
    console.log("✅ server is Ready! http://localhost:3000")
);
