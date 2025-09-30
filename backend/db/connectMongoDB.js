import mongoose from 'mongoose'
import createDatabaseIndexes from './createIndexes.js'

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
        // Create database indexes after connection
        if (process.env.NODE_ENV !== 'test') {
            await createDatabaseIndexes();
        }
        
    } catch (error) {
        console.error(`Error connection to MongoDB: ${error.message}`);
        process.exit(1)
    }
}

export default connectMongoDB