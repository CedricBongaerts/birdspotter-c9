var Capture = require('../models/capture');
var Comment = require('../models/comment');

module.exports = function(router) {
    router.post('/captures', function(req, res){
        var capture = new Capture();
        capture.birdname = req.body.birdname;
        capture.place =  req.body.place;
        capture.userId = req.body.userId;
        capture.author = req.body.author;
        capture.picture = req.body.picture;
        capture.created_at = new Date();
        
        
        capture.save(function(err, data){
            if(err)
                throw err;
            console.log(req.body);
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
    
     router.delete('/captures', function(req, res){
          Capture.remove({}, function(err){
              res.json({result: err ? 'error' : 'ok'});
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
    
    // router.get('/captures/:capture', function(req, res){
    //      req.capture.populate('comments');   
    //      Capture.findOne({_id: req.params.capture}, function(err, data){
    //         if(err) 
    //             throw err;
    //          res.json(data);
    //     });
    //  });
     
    router.get('/captures/:capture', function(req, res) {
	    req.capture.populate('comments', 
	        function (err, capture) {
	            if(err)
	                throw err;
		        res.json(capture);
    	});
    });
    
     router.delete('/captures/:id', function(req, res){
         Capture.remove({_id: req.params.id}, function(err){
             res.json({result: err ? 'error' : 'ok'});
         });
     });
     
    router.post('/captures/:capture/comments', function(req, res, next){
        var comment = new Comment();
        comment.body =  req.body.body;
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
};