var express = require('express');
var router = express.Router();

var user_md = require('../models/user');
var post_md = require('../models/post');
const helper = require('../helpers/helper');
router.get('/', function (req, res) {
    if (req.session.user) {
        var data = post_md.getAllPosts();
        data.then(function (posts) {
            var data = {
                posts: posts,
                error: false
            };
            res.render('admin/dashboard', { data: data });
        }
        ).catch(err => {
            res.render('admin/dashboard', { data: { error: 'Could not get posts data' } });
        });
    } else {
        res.redirect('/admin/signin');
    }
});

router.get('/signup', function (req, res) {
    res.render('signup', { data: {} });
});

router.post('/signup', async (req, res) => {
    var user = req.body;

    // Validate email
    if (user.email.trim().length === 0) {
        return res.render('signup', { data: { error: 'Email is required' } });
    }

    // Validate password match
    if (user.password !== user.repassword) {
        return res.render('signup', { data: { error: 'Password does not match' } });
    }

    // Validate password length
    if (user.password.trim().length === 0) {
        return res.render('signup', { data: { error: 'Password is required' } });
    }

    // Insert to db (placeholder for database insertion logic)
    var password = helper.hashPassword(user.password);
    user = {
        email: user.email,
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
    }
    var result = await user_md.addUser(user);
    if (!result) {
        return res.render('signup', { data: { error: 'Could not insert user to database' } });
    } else {
        return res.render('signup', { data: { success: 'Signup successful! Please login.' } });
    }
});

router.get('/signin', function (req, res) {
    res.render('signin', { data: {} });
});

router.post('/signin', async (req, res) => {
    var params = req.body;

    if (params.email.trim().length === 0) {
        return res.render('signin', { data: { error: 'Email is required' } });
    }

    if (params.password.trim().length === 0) {
        return res.render('signin', { data: { error: 'Password is required' } });
    }

    var data = await user_md.getUserByEmail(params.email);
    if (!data) {
        return res.render('signin', { data: { error: 'Email not exists' } });
    }

    var status = helper.comparePassword(params.password, data.password);
    if (!status) {
        return res.render('signin', { data: { error: 'Password incorrect' } });
    }

    // Set session
    req.session.user = data;
    return res.redirect('/admin');
});

router.get('/post/new', function (req, res) {
    if (req.session.user) {
        res.render('admin/post/new', { data: { error: false } });
    } else {
        res.redirect('/admin/signin');
    }
});

router.post('/post/new', async (req, res) => {
    var post = req.body;

    if (post.title.trim().length === 0) {
        return res.render('admin/post/new', { data: { error: 'Title is required' } });
    }

    if (post.content.trim().length === 0) {
        return res.render('admin/post/new', { data: { error: 'Content is required' } });
    }

    var data = await post_md.addPost(post);
    if (!data) {
        return res.render('admin/post/new', { data: { error: 'Could not insert post to database' } });
    } else {
        return res.redirect('/admin');
    }
});

router.get('/post/edit/:id', async (req, res) => {
    if (req.session.user) {
        var params = req.params;
        var id = params.id;
        var post = await post_md.getPostById(id);
        if (!post) {
            return res.render('admin/post/edit', { data: { error: 'Could not get post data' } });
        }
        res.render('admin/post/edit', { data: post, error: false });
    } else {
        res.redirect('/admin/signin');
    }
});

router.put('/post/edit', async (req, res) => {
    var post = req.body;
    var data = await post_md.updatePost(post);
    if (!data) {
        res.status(500);
        return res.render('admin/post/edit', { data: { error: 'Could not update post data' } });
    }
    res.status(200);
    return res.render('admin/post/edit', { data: { error: false } });
});

router.delete('/post/delete', async (req, res) => {
    var post = req.body;
    var data = await post_md.deletePost(post.id);
    if (!data) {
        res.status(500);
        return res.json({ status: 500 });
    }
    res.status(200);
    return res.json({ status: 200 });
});

router.get("/users", function (req, res) {
    if (req.session.user) {
        var data = user_md.getAllUsers();
        data.then(function (users) {
            var data = {
                users: users,
                error: false
            };
            res.render('admin/user', { data: data });
        }
        ).catch(err => {
            res.render('admin/user', { data: { error: 'Could not get users data' } });
        });
    } else {
        res.redirect('/admin/signin');
    }
});

//logout
router.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy();
    }
    res.redirect('/admin/signin');
});

module.exports = router;
