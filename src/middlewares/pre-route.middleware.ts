import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";

import type { Application } from "express";

export default (app: Application) => {
    // Set Env File
    dotenv.config({
        path: path.resolve(__dirname, "..", "..", ".env")
    });

    // enable CORS
    app.use(
        cors({
            credentials: true,
            exposedHeaders: ["set-cookie"],
            origin: ["http://localhost:3000", "https://oasm-frontend.vercel.app"]
        })
    );

    // Secure the app by setting various HTTP headers off.
    app.use(helmet({ contentSecurityPolicy: false }));

    // Logger
    app.use(morgan("common"));

    // Tell express to recognize the incoming Request Object as a JSON Object
    app.use(express.json({ limit: "10mb" }));

    // app.use(express.static(path.join(__dirname, "..", "..", "public")));

    // Express body parser
    // app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    app.use(
        bodyParser.urlencoded({
            extended: true,
            limit: "10mb"
        })
    );

    // Server Uploads
    app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

    return app;
};
