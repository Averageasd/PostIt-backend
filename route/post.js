const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Comment = require('../model/Comment');
const Post = require('../model/Post');
const jwt = require('jsonwebtoken');
const verifyToken = require('../jwt-utility/verify');
const {Types} = require("mongoose");

router.post('/create', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status: 403, msg: 'please log in to create post!'});
        } else {
            try {
                const user = authData.user;
                const post = new Post(
                    {
                        title: req.body.title,
                        text: req.body.text,
                        date: new Date(),
                        user: user._id
                    });
                await post.save();
                res.status(200).json({status: 200, post: post});
            } catch (e) {
                res.status(400).json({msg: 'Cannot create post!'});
            }
        }
    });
});

router.get('/viewAll', async (req, res) => {
    try {
        const allPosts = await Post
            .find({}).populate('user', '-password')
            .populate({path: 'comments', populate: {path: 'user', select: 'username'}})
            .sort({'date': -1})
            .exec();
        res.status(200).json({posts: allPosts});
    } catch (e) {
        res.status(400).json('something went wrong. Cannot get posts');
    }

});

router.post('/delete/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status: 403, msg: 'please log in to delete post!'});
        } else {
            try {
                const deletePost = await Post.findByIdAndDelete(req.params.id).exec();
                if (!deletePost) {
                    res.status(400).json({status: 400, msg: 'Cannot delete post! Post not found'});
                } else {
                    await Comment.deleteMany({post: new Types.ObjectId(req.params.id)}).exec();
                    res.status(200).json({status: 200, postId: req.params.id});
                }

            } catch (e) {
                res.status(400).json({msg: 'Cannot delete post! post not found!'});
            }

        }
    });
});

router.post('/update/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status: 403, msg: 'please log in to update post!'});
        } else {
            try {
                const newPost = await Post.findByIdAndUpdate(req.params.id, {
                        title: req.body.title,
                        text: req.body.text,
                        date: new Date(),
                    }, {new: true}
                ).exec();

                const updatedPost = await Post.findById(req.params.id).populate('user').populate('comments').exec();
                if (!newPost) {
                    res.status(400).json({status: 400, msg: 'Cannot update post! Post not found!'});
                } else {
                    res.status(200).json({status: 200, post: updatedPost});
                }


            } catch (e) {
                res.status(400).json({msg: 'Cannot update post! Post not found!'});
            }
        }
    })
});

router.get('/view/:id', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status: 403, msg: 'please log in to view post!'});
        } else {
            try {
                const post = await Post.findById(req.params.id).populate('user').populate('comments').exec();
                if (!post) {
                    res.status(400).json({status: 400, msg: 'Cannot view post! Post not found!'});
                } else {
                    res.status(200).json({status: 200, post: post});
                }

            } catch (e) {
                console.log(e.message);
                res.status(400).json({msg: 'Cannot view post! Post not found!'});
            }
        }
    });
});


module.exports = router;