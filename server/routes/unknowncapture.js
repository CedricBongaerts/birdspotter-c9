var UnknownCapture = require('../models/unknowncapture');

module.exports = function(router) {
    router.post('/unknowncaptures', function(req, res){
        var unknownCapture = new UnknownCapture();
        unknownCapture.place =  req.body.place;
        unknownCapture.author = req.body.author;
        unknownCapture.picture = req.body.picture;
        unknownCapture.picture_uuid = req.body.picture_uuid;
        unknownCapture.created_at = new Date();
        unknownCapture.original_id = req.body.original_id;
        
        
        unknownCapture.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.get('/unknowncaptures', function(req, res){
        UnknownCapture.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
};