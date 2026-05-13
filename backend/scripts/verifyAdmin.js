require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const { SEED_ADMIN_EMAIL = "dev_admin@example.com", SEED_ADMIN_PASSWORD } = process.env;

const verifyAdmin = async () => {
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI or MONGODB_URI.");
  }
  if (!SEED_ADMIN_PASSWORD) {
    throw new Error("Missing SEED_ADMIN_PASSWORD.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });

  const admin = await User.findOne({ email: SEED_ADMIN_EMAIL.toLowerCase() });
  if (!admin) {
    throw new Error(`Admin not found: ${SEED_ADMIN_EMAIL}`);
  }

  const passwordMatches = await admin.isValidPassword(SEED_ADMIN_PASSWORD);
  if (!admin.isAdmin || !passwordMatches) {
    throw new Error(`Admin verification failed: ${admin.email} role=${admin.isAdmin ? "admin" : "customer"}`);
  }

  console.log(`Verified admin: ${admin.email} role=admin password=valid`);
};

verifyAdmin()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error(error.message || error);
    await mongoose.disconnect();
    process.exit(1);
  });
