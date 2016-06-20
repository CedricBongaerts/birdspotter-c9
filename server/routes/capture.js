var Capture = require('../models/capture');
var Comment = require('../models/comment');
var Vote = require('../models/vote');
var Notification = require('../models/notification');


module.exports = function(router) {
    router.post('/captures', function(req, res){
        var capture = new Capture();
        capture.type = req.body.type;
        capture.birdname = req.body.birdname;
        capture.place =  req.body.place;
        capture.note = req.body.note;
        capture.userId = req.body.userId;
        capture.author = req.body.author;
        capture.picture = req.body.picture;
        capture.created_at = new Date();
        
        
        capture.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.get('/captures', function(req, res){
        Capture.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    // Map logic to route parameter 'capture'
    router.param('capture', function(req, res, next, id) {
    	var query = Capture.findById(id);
    	
    	query.exec(function (err, capture) {
    		if (err) { return next(err); }
    		if (!capture) { return next(new Error("can't find post")); }
    		
    		req.capture = capture;
    		return next();
    	});
    });
    
    // Map logic to route parameter 'comment'
    router.param('comment', function (req, res, next, id) {
    	var query = Comment.findById(id);
    	
    	query.exec(function (err, comment) {
    		if (err) { return next(err); }
    		if (!comment) { return next(new Error("can't find comment")); }
    		
    		req.comment = comment;
    		return next();
    	});
    });  
    
    // Map logic to route parameter 'vote'
    router.param('vote', function (req, res, next, id) {
    	var query = Vote.findById(id);
    	
    	query.exec(function (err, vote) {
    		if (err) { return next(err); }
    		if (!vote) { return next(new Error("can't find comment")); }
    		
    		req.vote = vote;
    		return next();
    	});
    });  
     
    router.get('/captures/:capture', function(req, res) {
	    req.capture.populate('comments',
	        function (err, capture) {
	            if (err) throw err;
	            req.capture.populate('votes',
	                function(err, capture) {
	                    if(err) throw err;
	                    
		            res.json(capture);
            });
    	});
    });
    
     router.delete('/captures/:capture', function(req, res){
            req.capture.comments.forEach(function(id) {
        		Comment.remove({
        			_id: id
        		}, function(err) {
        			if (err) { throw err;}
        		});
        	});
            req.capture.votes.forEach(function(id) {
        		Vote.remove({
        			_id: id
        		}, function(err) {
        			if (err) { throw err;}
        		});
        	});
        	
        Capture.remove({
		    _id: req.params.capture
        }, function(err, captures) {
    		if (err) { throw err }
    		
    		// get and return all the posts after you delete one
    		Capture.find(function(err, captures) {
    			if (err) { throw err }
    			
    			res.json(captures);
    		});
    	});
     });
     
     router.post('/captures/:id', function(req, res){
        Capture.findOne({_id: req.params.id}, function(err, data) {
            var capture = data;
            capture.type = req.body.type;
            capture.birdname = req.body.birdname;
            capture.note = req.body.note;
            capture.updated_at = new Date();
            
            
            if(err) throw err;
            capture.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
                });
        });
    });
};