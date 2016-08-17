var VoteBirdsuggestion = require('../models/voteBirdsuggestion');
var Birdsuggestion = require('../models/birdsuggestion');
// var Notification = require('../models/notification');

module.exports = function(router) {
    router.post('/birdsuggestions/:birdsuggestion/votesbirdsuggestion', function(req, res, next){
        var voteBirdsuggestion = new VoteBirdsuggestion();
        voteBirdsuggestion.userId = req.body.userId;
        voteBirdsuggestion.voteFrom = req.body.voteFrom;
        voteBirdsuggestion.birdsuggestion = req.birdsuggestion;
        
        console.log(voteBirdsuggestion);
        voteBirdsuggestion.save(function(err, data){
            if(err)
                throw err;
    		
    		req.birdsuggestion.votesBirdsuggestion.push(voteBirdsuggestion);
    		req.birdsuggestion.save(function(err, birdsuggestion) {
    			if (err) { return next(err); }
    			
    			res.json(voteBirdsuggestion);
    		});
        });
    });
    

    router.get('/votesBirdsuggestion', function(req, res){
        VoteBirdsuggestion.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    // router.delete('/votes/:vote', function(req, res){
    //     req.vote.notification.forEach(function(id) {
    // 		Notification.remove({
    // 			_id: id
    // 		}, function(err) {
    // 			if (err) { throw err;}
    // 		});
    // 	});
    	
    //     Vote.findByIdAndRemove(req.params.vote, function(err, vote){
    //         if (vote) {
    //             Capture.update({_id: vote.capture}, {
    //                     $pull : {votes: req.params.vote}
    //                 }, function(err, data) { if(err) throw err; });
    //         } if(err) throw err;
    //     });
        
    //  });
};