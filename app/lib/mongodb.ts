import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose.mongooseCache = cached;

function getMongoConfig() {
  const mongodbUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;

  if (!mongodbUri) {
    throw new Error("Please add MONGODB_URI in .env");
  }

  if (!jwtSecret) {
    throw new Error("Please add JWT_SECRET in .env");
  }

  return {
    mongodbUri,
    jwtSecret,
  };
}

async function connectDB() {
  const { mongodbUri } = getMongoConfig();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUri, {
        dbName: "myapp",
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
