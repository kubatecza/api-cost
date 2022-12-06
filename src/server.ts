import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logs from './library/Logs';
import Requests from './routes/Cost';

const router = express();

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logs.info('Connected to database.');
        StartServer();
    })
    .catch((error) => {
        Logs.error('Not able to connect:');
        Logs.error(error);
    });

const StartServer = () => {
    router.use((req, res, next) => {
        Logs.info(`Request: [${req.method}] | URL: [${req.url}] | IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logs.info(`Request: [${req.method}] | URL: [${req.url}] | IP: [${req.socket.remoteAddress}] | Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use('/costs', Requests);

    router.use((req, res, next) => {
        const error = new Error('not found');
        Logs.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logs.info(`Server is listening on port ${config.server.port}.`));
};
