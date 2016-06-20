var Follow = require('../models/follow');
var Notification = require('../models/notification');

module.exports = function(router) {
    router.post('/follows', function(req, res){
        var follow = new Follow();
        follow.followed_id = req.body.followed_id;
        follow.follower_id = req.body.follower_id;
        follow.created_at = new Date();
        
        
        follow.save(function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.get('/follows', function(req, res){
        Follow.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    // Map logic to route parameter 'follow'
    router.param('follow', function (req, res, next, id) {
    	var query = Follow.findById(id);
    	
    	query.exec(function (err, follow) {
    		if (err) { return next(err); }
    		if (!follow) { return next(new Error("can't find follow")); }
    		
    		req.follow = follow;
    		return next();
    	});
    });  
    
    router.delete('/follows/:follow', function(req, res){
        req.follow.notification.forEach(function(id) {
    		Notification.remove({
    			_id: id
    		}, function(err) {
    			if (err) { throw err;}
    		});
    	});
    	
         Follow.remove({_id: req.params.follow}, function(err){
             res.json({result: err ? 'error' : 'ok'});
         });
     });
};