var Vote = require('../models/vote');
var Capture = require('../models/capture');
var Notification = require('../models/notification');

module.exports = function(router) {
    router.post('/captures/:capture/votes', function(req, res, next){
        var vote = new Vote();
        vote.userId = req.body.userId;
        vote.userName = req.body.userName;
        vote.votedFor = req.body.votedFor;
        vote.capture = req.capture;
        
        vote.save(function(err, data){
            if(err)
                throw err;
    		
    		req.capture.votes.push(vote);
    		req.capture.save(function(err, capture) {
    			if (err) { return next(err); }
    			
    			res.json(vote);
    		});
        });
    });

    router.get('/votes', function(req, res){
        Vote.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.delete('/votes/:vote', function(req, res){
        req.vote.notification.forEach(function(id) {
    		Notification.remove({
    			_id: id
    		}, function(err) {
    			if (err) { throw err;}
    		});
    	});
    	
        Vote.findByIdAndRemove(req.params.vote, function(err, vote){
            if (vote) {
                Capture.update({_id: vote.capture}, {
                        $pull : {votes: req.params.vote}
                    }, function(err, data) { if(err) throw err; });
            } if(err) throw err;
        });
        
     });
};