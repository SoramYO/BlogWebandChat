var express = require('express');
var post_md = require('../models/post');
var router = express.Router();

router.use('/admin', require(__dirname + '/admin'));
router.use('/blog', require(__dirname + '/blog'));

router.get('/', async function (req, res) {
    try {
        var data = await post_md.getAllPosts();
        res.render('blog/index', { data: data });
    } catch (error) {
        console.error('Error getting posts:', error);
        res.render('blog/index', { data: [], error: 'Could not get posts data' });
    }
});

router.get('/chat', function (req, res) {
    res.render('chat');
});

module.exports = router;