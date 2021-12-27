import express from "express";
import rootRouter from "./routers/rootRouter";
import channelRouter from "./routers/channelRouter";
import watchRouter from "./routers/watchRouter";
import feedRouter from "./routers/feedRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use("/", rootRouter);
app.use("/channel", channelRouter);
app.use("/watch", watchRouter);
app.use("/feed", feedRouter);

export default app;
