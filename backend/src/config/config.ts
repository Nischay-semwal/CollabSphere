import 'dotenv/config'

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || "";

if(!MONGO_URI){
    throw new Error("Please provide MONGO_URI in .env file");
}

if(!JWT_TOKEN_KEY){
    throw new Error("Please provide JWT token key in .env file")
}