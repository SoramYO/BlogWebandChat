var express = require('express');
var router = express.Router();
var post_md = require('../models/post');

router.get('/', async function (req, res) {
    try {
        var data = await post_md.getAllPosts();
        res.render('blog/index', { data: data });
    } catch (error) {
        console.error('Error getting posts:', error);
        res.render('blog/index', { data: [], error: 'Could not get posts data' });
    }
});

router.get('/post/:id', async function (req, res) {
    var id = req.params.id;
    try {
        var data = await post_md.getPostById(id);
        res.render('blog/post', { data: data });
    } catch (error) {
        console.error('Error getting post:', error);
        res.render('blog/post', { data: {}, error: 'Could not get post data' });
    }
});

router.get('/about', function (req, res) {
    res.render('blog/about', { title: 'About' });
});

router.get('/contact', function (req, res) {
    res.render('blog/contact', { title: 'Contact' });
});

module.exports = router;
