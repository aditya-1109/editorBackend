import dotenv from "dotenv";

dotenv.config();
import express from "express";
import passport from "passport";
import { google } from "googleapis";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  console.log(process.env.GOOGLE_CLIENT_ID);
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  
  // Protect dashboard route
  router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.send(`Welcome, ${req.user.displayName}`);
  });
  

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard"); // Redirect to frontend
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  res.send("Logged out");
});

// Get User Route
router.get("/user", (req, res) => {
  res.send(req.user);
});

router.post("/upload", async (req, res) => {
  try {
    const { letter } = req.body;
    const fileMetadata = {
      name: "Letter.docx",
      mimeType: "application/vnd.google-apps.document",
    };

    const media = {
      mimeType: "text/plain",
      body: letter,
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    res.json({ success: true, fileId: file.data.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
