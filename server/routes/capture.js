var Capture = require('../models/capture');
module.exports = function(router) {
    router.post('/captures', function(req, res){
        var capture = new Capture();
        capture.birdname = req.body.birdname;
        capture.place =  req.body.place;
        
        capture.save(function(err, data){
            if(err)
                throw err;
            console.log(req.body);
            res.json(data);
        });
    });
    
    router.get('/captures', function(req, res){
        Capture.find({}, function(err, data){
            res.json(data);
        });
    });
    
    // router.delete('/captures', function(req, res){
    //      Capture.remove({}, function(err){
    //          res.json({result: err ? 'error' : 'ok'});
    //      });
    //  });
    
    // router.get('/captures/:id', function(req, res){
    //     Capture.findOne({_id: req.params.id}, function(err, data){
    //         res.json(data);
    //     });
    // });
    
    // router.delete('/captures/:id', function(req, res){
    //     Capture.remove({_id: req.params.id}, function(err){
    //         res.json({result: err ? 'error' : 'ok'});
    //     });
    // });
    
    // router.post('/captures/:id', function(req, res){
    //     Capture.findOne({_id: req.params.id}, function(err, data){
    //         var capture = data;
    //         capture.birdname = req.body.birdname;
    //         capture.place.city = req.body.place.city;
    //         capture.place.country = req.body.place.country;
            
    //         capture.save(function(err, data){
    //             if(err)
    //                 throw err;
    //             res.json(data);
    //         });
    //     })
    // })
}