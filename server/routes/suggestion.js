var Suggestion = require('../models/suggestion');
var Capture = require('../models/capture');

module.exports = function(router) {
    router.post('/captures/:capture/suggestions', function(req, res, next){
        var suggestion = new Suggestion();
        suggestion.suggestedBirdname =  req.body.suggestedBirdname;
        suggestion.acceptedSuggestion = req.body.acceptedSuggestion;
        suggestion.userId = req.body.userId;
        suggestion.author = req.body.author;
        suggestion.created_at = new Date();
        suggestion.capture = req.capture;
        
        suggestion.save(function(err, suggestion) {
    		if (err) { return next(err); }
    		
    		req.capture.comments.push(suggestion);
    		req.capture.save(function(err, capture) {
    			if (err) { return next(err); }
    			
    			res.json(suggestion);
    		});
        });
    });
    
    router.get('/suggestions', function(req, res){
        Suggestion.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.delete('/suggestions/:id', function(req, res){
        Suggestion.findByIdAndRemove(req.params.id, function(err, suggestion){
            if (suggestion) {
                Capture.update({_id: suggestion.capture}, {
                        $pull : {suggestion: req.params.id}
                    }, function(err, data) { if(err) throw err; });
            } if(err) throw err;
        });
    });
};