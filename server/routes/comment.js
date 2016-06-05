var Comment = require('../models/comment');
var Capture = require('../models/capture');

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
    
    router.delete('/comments/:id', function(req, res){
        Comment.findByIdAndRemove(req.params.id, function(err, comment){
            if (comment) {
                Capture.update({_id: comment.capture}, {
                        $pull : {comments: req.params.id}
                    }, function(err, data) { if(err) throw err; });
            } if(err) throw err;
        });
     });
};