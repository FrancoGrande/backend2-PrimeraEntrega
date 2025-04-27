import {__dirname} from "./utils.js";
import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import viewRouter from "./routes/view.router.js";
import sessionRouter from "./routes/session.router.js";
import {config} from "./config/config.js";
import initializePassport  from "./config/passport.config.js";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongoURL = config.MONGO_URL;

mongoose.connect(config.MONGO_URL)
    .then( () => console.log("Conexión a base de datos exitosa"))
    .catch( (error) => console.error('Error de conexión: ', error));





app.use(session({
    store: MongoStore.create({ mongoUrl: mongoURL}),
    secret: 'asd3nc3okasod',
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewRouter);
app.use("/api/sessions", sessionRouter);

app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}`);
});
