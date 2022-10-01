import mongoose from 'mongoose';

const { DB_URI } = process.env;

export const mongodb = async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI);
    console.info(`Connected to Mongo! Database name: ${connection.name}`);
  } catch (error) {
    console.error(`Error connecting to mongo database, Error description: ${error}`);
  }
};