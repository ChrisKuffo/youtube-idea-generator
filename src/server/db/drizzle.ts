import { config } from "dotenv"; // Import the config function from the dotenv package
import { drizzle } from 'drizzle-orm/neon-http'; // Import the drizzle function from the drizzle-orm package

// Load environment variables from a .env file
config({ path: ".env" }); // This line reads the .env file and loads the environment variables into process.env

// Create a database connection using the drizzle ORM
export const db = drizzle(process.env.DATABASE_URL!); // Use the DATABASE_URL environment variable to connect to the database
