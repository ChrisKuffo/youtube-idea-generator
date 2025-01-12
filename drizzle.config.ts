import { config } from 'dotenv'; // Import the config function from the dotenv package
import { defineConfig } from "drizzle-kit"; // Import the defineConfig function from drizzle-kit

// Load environment variables from a .env file
config({ path: '.env' }); // This line reads the .env file and loads the environment variables into process.env

// Define the configuration for Drizzle ORM
export default defineConfig({
  schema: "./src/server/db/schema.ts", // Path to the schema file that defines the database structure
  out: "./migrations", // Directory where migration files will be generated
  dialect: "postgresql", // Database dialect being used (PostgreSQL in this case)
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Database connection URL from environment variables
  },
});
