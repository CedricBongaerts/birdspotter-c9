var Birdsuggestion = require('../models/birdsuggestion');
var VoteBirdsuggestion = require('../models/voteBirdsuggestion');
var Capture = require('../models/capture');
var Notification = require('../models/notification');

module.exports = function(router) {
    router.post('/captures/:capture/birdsuggestions', function(req, res, next){
        var birdsuggestion = new Birdsuggestion();
        birdsuggestion.birdSuggestion = req.body.birdSuggestion;
        birdsuggestion.userId = req.body.userId;
        birdsuggestion.author = req.body.author;
        birdsuggestion.created_at = new Date();
        birdsuggestion.capture = req.capture;
        
        birdsuggestion.save(function(err, birdsuggestion) {
    		if (err) { return next(err); }
    		
    		req.capture.birdsuggestions.push(birdsuggestion);
    		req.capture.save(function(err, capture) {
    			if (err) { return next(err); }
    			
    			res.json(birdsuggestion);
    		});
        });
    });
    
    router.get('/birdsuggestions', function(req, res){
        Birdsuggestion.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.delete('/birdsuggestions/:birdsuggestion', function(req, res){
        req.birdsuggestion.notification.forEach(function(id) {
    		Notification.remove({
    			_id: id
    		}, function(err) {
    			if (err) { throw err;}
    		});
    	});
    	
        Birdsuggestion.findByIdAndRemove(req.params.birdsuggestion, function(err, birdsuggestion){
            if (birdsuggestion) {
                Capture.update({_id: birdsuggestion.capture}, {
                        $pull : {birdsuggestions: req.params.birdsuggestion}
                    }, function(err, data) { if(err) throw err; });
            } if(err) throw err;
        });
        
     });
};