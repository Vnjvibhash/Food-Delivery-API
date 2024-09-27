import "dotenv/config";
import Fastify from 'fastify'
import {connectDB} from "./src/config/connect.js";
import { MONGO_URL, PORT } from './src/config/config.js';
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
    await connectDB(MONGO_URL);
    const app = Fastify();

    app.register(fastifySocketIO, {
        cors: {
            origin: '*',
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ['websocket'],
    })

    await registerRoutes(app);

    await buildAdminRouter(app);

    app.listen({ port: PORT || 3000, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening on http://localhost:${PORT || 3000}${admin.options.rootPath}`);
    });

    app.ready().then(() => {
        app.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('joinRoom', (orderId) => {
                socket.join(orderId);
                console.log(`User joined room: ${orderId} ❤️`);
            });
            socket.on('disconnect', () => {
                console.log('user disconnected 💔');
            });
        })
    });
}

start();