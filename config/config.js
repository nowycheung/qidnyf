var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'qidnyf'
        },
        port: 3000,
        db: 'mongodb://fyndiq:fyndiq@ds045097.mongolab.com:45097/fyndiq'
    },

    test: {
        root: rootPath,
        app: {
            name: 'qidnyf'
        },
        port: 3000,
        db: 'mongodb://fyndiq:fyndiq@ds045097.mongolab.com:45097/fyndiq'
    },

    production: {
        root: rootPath,
        app: {
            name: 'qidnyf'
        },
        port: 3000,
        db: 'mongodb://fyndiq:fyndiq@ds045097.mongolab.com:45097/fyndiq'
    }
};

module.exports = config[env];