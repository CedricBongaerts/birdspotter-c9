var SuggestionVote = require('../models/suggestionVote');
var Suggestion = require('../models/suggestion');
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