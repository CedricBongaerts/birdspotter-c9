var Follow = require('../models/follow');

module.exports = function(router) {
    router.post('/follows', function(req, res){
        var follow = new Follow();
        follow.followed_id = req.body.followed_id;
        follow.follower_id = req.body.follower_id;
        follow.created_at = new Date();
        
        
        follow.save(function(err, data){
            if(err)
                throw err;
            console.log(req.body);
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
    
    router.delete('/follows/:id', function(req, res){
         Follow.remove({_id: req.params.id}, function(err){
             res.json({result: err ? 'error' : 'ok'});
             console.log('unfollowed');
         });
     });
};