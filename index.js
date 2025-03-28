import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";


import passport from "passport";
import session from "cookie-session";
import "./auth.js";
import router from "./routes/authRoutes.js";




const app = express();
app.use(cors());

app.use(cors({ origin: "https://google-editor-pink.vercel.app", credentials: true }));
app.use(express.json());
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", router);

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
