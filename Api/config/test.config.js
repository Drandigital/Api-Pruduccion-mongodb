var config = {
    env: 'test',
    db: {

        mongo: {
            MONGO_HOST: 'cluster0-shard-00-02-3hc1e.mongodb.net',
            MONGO_PORT: '27017',
            MONGO_SSL: 1,
            MONGO_DATABASE: 'CondominioDB',
            MONGO_USER: 'frayder',
            MONGO_PASSWORD: 'fs_xxxx',
            MONGO_AUTH_SOURCE: 'admin'
        }

    },
    server: {
        host: '0.0.0.0',
        port: 3040,
        enableDebugMode: true,
    }
};

module.exports = Object.freeze(config);