var express = require('express'),
    app = express(),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose'),
    db,
    models;

mongoose.connect(config.db);

db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.db);
});

models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function(model) {
    require(model);
});

require('./config/express')(app, config);

app.listen(config.port);