var Notification = require('../models/notification');

module.exports = function(router) {
    
    router.post('/votes/:vote/notifications', function(req, res, next){
        var notification = new Notification();
        notification.notificationFor = req.body.notificationFor;
        notification.notificationFrom = req.body.notificationFrom;
        notification.concirning = req.body.concirning;
        notification.parameter = req.body.parameter;
        notification.detected = false,
        notification.seen = false;
        notification.created_at = new Date();
        
        notification.save(function(err, notification) {
    		if (err) { return next(err); }
    		
    		req.vote.notification.push(notification);
    		req.vote.save(function(err, vote) {
    			if (err) { return next(err); }
    			
    			res.json(notification);
    		});
        });
    });
    
    router.post('/comments/:comment/notifications', function(req, res, next){
        var notification = new Notification();
        notification.notificationFor = req.body.notificationFor;
        notification.notificationFrom = req.body.notificationFrom;
        notification.concirning = req.body.concirning;
        notification.parameter = req.body.parameter;
        notification.detected = false,
        notification.seen = false;
        notification.created_at = new Date();
        notification.comment = req.comment;
        
        notification.save(function(err, notification) {
    		if (err) { return next(err); }
    		
    		req.comment.notification.push(notification);
    		req.comment.save(function(err, comment) {
    			if (err) { return next(err); }
    			
    			res.json(notification);
    		});
        });
    });
    
    router.post('/follows/:follow/notifications', function(req, res, next){
        var notification = new Notification();
        notification.notificationFor = req.body.notificationFor;
        notification.notificationFrom = req.body.notificationFrom;
        notification.concirning = req.body.concirning;
        notification.parameter = req.body.parameter;
        notification.detected = false,
        notification.seen = false;
        notification.created_at = new Date();
        notification.follow = req.follow;

        
        notification.save(function(err, notification) {
    		if (err) { return next(err); }
    		
    		req.follow.notification.push(notification);
    		req.follow.save(function(err, follow) {
    			if (err) { return next(err); }
    			
    			res.json(notification);
    		});
        });
    });
    
    router.get('/notifications', function(req, res){
        Notification.find({}, function(err, data){
            if(err)
                throw err;
            res.json(data);
        });
    });
    
    router.post('/notifications/:id', function(req, res){
        Notification.findOne({_id: req.params.id}, function(err, data) {
            var notification = data;
            notification.seen = req.body.seen;
            notification.detected = req.body.detected;
            notification.updated_at = new Date();
            if(err) throw err;
            notification.save(function(err, data){
                if(err)
                    throw err;
                res.json(data);
            });
        });
    });
};