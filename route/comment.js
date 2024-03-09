const express = require('express');
const router = express.Router();
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const jwt = require('jsonwebtoken');
const verifyToken = require('../jwt-utility/verify');
const mongoose = require("mongoose");
const {Types} = require("mongoose");

router.post('/create/:postid', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status:403, msg: 'please log in to create comment!'});
        } else {
            try {
                const newComment = new Comment({
                    text: req.body.text, date: new Date(), user: authData.user._id, post: req.params.postid
                });
                const post = await Post.findById(req.params.postid).exec();
                if (!post) {
                    res.status(400).json({status:400, msg: 'Cannot post comment! Post not found'});
                } else {
                    await newComment.save();
                    const updatedPost = await Post.findByIdAndUpdate(req.params.postid, {
                        comments: post.comments.concat(newComment._id)
                    }, {new: true});
                    console.log(updatedPost);
                    res.status(200).json({status:200, comment: newComment, post: updatedPost});
                }

            } catch (e) {
                console.log(e);
                res.status(400).json({msg: 'Cannot post comment! Post not found'});
            }

        }
    });
});

router.post('/delete/:postid/comment/:commentid', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status:403, msg: 'please log in to delete comment!'});
        } else {
            try {
                const comment = await Comment.findByIdAndDelete(req.params.commentid).exec();
                const post = await Post.findById(req.params.postid).exec();
                const updatedPost = await Post
                    .findByIdAndUpdate(req.params.postid, {comments: post.comments.filter((commentId) => !commentId.equals(new Types.ObjectId(req.params.commentid)))} ,
                        {new: true})
                    .exec();
                if (!updatedPost || !comment) {
                    res.status(400).json({status:400, msg: 'Cannot delete comment! Post or comment not found'});
                } else {
                    res.status(200).json({status:200, post: updatedPost});
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({msg: 'Cannot delete comment! Post or comment not found'});
            }
        }
    })
});

router.post('/update/:commentid', verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status:403, msg: 'please log in to update comment!'});
        } else {
            try {
                const comment = await Comment.findByIdAndUpdate(req.params.commentid, {
                    text: req.body.text
                }, {new: true}).exec();
                if (!comment) {
                    res.status(400).json({status:400, msg: 'Cannot update comment! Comment not found'});
                } else {
                    res.status(200).json({status:200, comment: comment});
                }
            } catch (e) {
                res.status(400).json({msg: 'Cannot update comment! Comment not found'});
            }
        }
    })
});

router.get('/view/:id', verifyToken, async (req, res)=>{
    jwt.verify(req.token, 'secretKey', async (err, authData) => {
        if (err) {
            res.status(403).json({status:403, msg: 'please log in to update comment!'});
        } else {
            try {
                const comment = await Comment.findById(req.params.id).exec();
                if (!comment) {
                    res.status(400).json({status:400, msg: 'Cannot view  comment! Comment not found'});
                } else {
                    res.status(200).json({status:200, comment: comment});
                }
            } catch (e) {
                res.status(400).json({msg: 'Cannot update comment! Comment not found'});
            }
        }
    })
})

module.exports = router;