import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`Database connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
