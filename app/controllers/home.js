var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Items = mongoose.model('Items'),
    Costumer = mongoose.model('Costumer');

function itemHandler(action, details, callback) {
    var items = {},
        action = action || "list";

    switch (action) {
        case "find":
            if (details.id) {
                Items.find({ id: details.id }, callback);
            } else {
                Items.find(callback);
            }
        break;
        case "add":
            if (details.brand && details.count) {
                var data = {
                    id: (new Date()).getTime(),
                    brand: details.brand,
                    description: details.description || "N/A",
                    count: details.count,
                    img: details.img,
                    price: details.price
                },
                items = new Items(data);

                items.save();

                callback(false, data);
            }
    }
}

function costumerHandler(action, details, callback) {
    var costumer = {},
        action = action || "login";

    switch (action) {
        case "new":
            if (details.name && details.email) {

                var data = {
                    id: (new Date()).getTime(),
                    name: details.name,
                    email: details.email
                },

                costumer = new Costumer(data);

                costumer.save();

                callback(false, data);
            } else {
                callback({error:"Name or Email is not provided"});
            }
        break;
        case "find":
            Costumer.find(details, callback);
        break;
        case "update":
            Costumer.findOne({id:details.id}, function(err, data) {
                if (data) {
                    console.log("Before action", data.cart);
                    if (details.action === "addItem") {
                        // Add
                        data.cart.push(details.itemId);
                    } else {
                        var index = data.cart.indexOf(details.itemId);
                        console.log("Remove index", index);
                        // Remove
                        data.cart.splice(index, 1);
                    }
                    console.log("After action", data.cart);
                    Costumer.findOneAndUpdate({id:details.id}, {cart:data.cart}, function(){
                        callback(false, data);
                    });
                } else {
                    callback({error: "User not found"});
                }
            });
        break;
    }
}

router.get('/', function(req, res, next) {
    res.render('partials/welcome', {
        title: 'qidnyF online store',
        id : req.session.userId
    });
});

router.get('/ajax', function(req, res, next) {
    var callback = req.query.callback,
        itemId = req.query.itemId || "",
        idArray = itemId ? itemId.split(",") : false,
        query;

    query = idArray ? {id:{"$in":idArray }} : {id: itemId};
    itemHandler("find", query, function(err, data){
        res.json(data);
    });
});

router.get('/items', function(req, res, next) {
    var VIEW = 'partials/items',
        query = req.query,
        action = query.action || "view",
        userId = req.session.userId,
        itemId = query.itemId;

    switch (action) {
        case "new":
            res.render(VIEW, {
                actionNew: true
            });
        break;
        case "save":
            if (query.brand && query.count && query.img && query.price) {
                itemHandler("add", {
                    brand: query.brand,
                    count: query.count,
                    description: query.description,
                    img: query.img,
                    price: query.price
                }, function(err, data){
                    res.redirect('/items?id=' + data.id);
                })
            } else {
                res.redirect('/items');
            }
        break;
        default:
            itemHandler("find", {
                id: itemId
            }, function(err, data){
                res.render(VIEW, {
                    actionView: true,
                    items: data,
                    itemId: itemId,
                    userId: userId
                });
            });
        break;
    }
});


router.get('/costumer', function(req, res, next) {
    var VIEW = 'partials/costumer',
        action = req.query.action || "view",
        email = req.query.email,
        name = req.query.name,
        userId = req.query.id || req.session.userId,
        itemId = req.query.itemId;

    switch (action) {
        case "logout":
            req.session.destroy();
            res.redirect('/');
        break;
        case "login":
            costumerHandler("find", {
                email: email
            }, function(err, data){
                console.log("DATA not found", email, data);
                if (data && data.length > 0) {
                    req.session.userId = data[0].id;

                    res.redirect('/costumer?action=view');
                } else {
                    res.render(VIEW, {
                        actionLogin: true
                    });
                }
            });
        break;
        case "new":
            res.render(VIEW, {
                actionNew: true
            });
        break;
        case "save":
            if (name && email) {
                var costumer,
                    data = {
                        id: (new Date()).getTime(),
                        name: name,
                        email: email,
                        cart: []
                    };
                costumer = new Costumer(data);
                costumer.save();

                res.redirect('/costumer?action=view');
            } else {
                res.redirect('/costumer?action=new');
            }
        break;
        case "view":
            costumerHandler("find", {
                id: userId
            }, function(err, data){
                if (data && data.length > 0) {
                    var userData = data[0];
                    res.render(VIEW, {
                        actionView: true,
                        email: userData.email,
                        name: userData.name,
                        id: userData.id,
                        cart: userData.cart
                    });
                } else {
                    res.redirect('/costumer?action=new');
                }
            });
        break;
        case "addItem":
            costumerHandler("update", {
                id: userId,
                itemId: itemId,
                action: action
            }, function(err, data) {
                console.log("addItem", err, data);
                if (err) {
                    res.redirect('/costumer?action=login');
                } else {
                    res.redirect('/costumer?action=view');
                }
            });
        break;
        case "removeItem":
            costumerHandler("update", {
                id: userId,
                itemId: itemId,
                action: action
            }, function(err, data) {
                console.log("addItem", err, data);
                if (err) {
                    res.redirect('/costumer?action=login');
                } else {
                    res.redirect('/costumer?action=view');
                }
            });
        break;
    }
});



module.exports = function(app) {
    app.use('/', router);
};
