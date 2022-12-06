import dotenv from 'dotenv';

dotenv.config();

export const { MONGO_URL } = process.env as {
    [key: string]: string;
};

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
