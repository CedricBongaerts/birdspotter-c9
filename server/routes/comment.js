var Comment = require('../models/comment');
var Capture = require('../models/capture');
var Notification = require('../models/notification');

module.exports = function(router) {
    router.post('/captures/:capture/comments', function(req, res, next){
        var comment = new Comment();
        comment.comment =  req.body.comment;
        comment.birdSuggestion = req.body.birdSuggestion;
        comment.userId = req.body.userId;
        comment.author = req.body.author;
        comment.created_at = new Date();
        comment.capture = req.capture;
        
        comment.save(function(err, comment) {
    		if (err) { return next(err); }
    		
    		req.capture.comments.push(comment);
    		req.capture.save(function(err, capture) {
    			if (err) { return next(err); }
    			
    			res.json(comment);
    		});
        });
    });
    
    router.get('/comments', function(req, res){
        Comment.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.delete('/comments/:comment', function(req, res){
        req.comment.notification.forEach(function(id) {
    		Notification.remove({
    			_id: id
    		}, function(err) {
    			if (err) { throw err;}
    		});
    	});
    	
        Comment.findByIdAndRemove(req.params.comment, function(err, comment){
            if (comment) {
                Capture.update({_id: comment.capture}, {
                        $pull : {comments: req.params.comment}
                    }, function(err, data) { if(err) throw err; });
            } if(err) throw err;
        });
        
     });
};