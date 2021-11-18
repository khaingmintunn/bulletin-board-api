const express = require('express')
const router = express.Router()
const { ERROR } = require('../constant')
const Post = require('../schemas/post')

router.get('/post', (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ message: ERROR.POST })
  }
})

//create a post
router.post('/', async (req,res) => {
  const newPost = new Post(req.body)
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error)
  }
})

//update a post
router.put('/:id', async (req,res) => {
  try{
    const post = await Post.findById(req.params.post_id);
    if(post.user_id === req.body.user_id){
      await post.updateOne({$set:req.body});
      res.status(200).json("Your post have been updated");
    }else{
      res.status(405).json("You can only update your post.");
    }
  }catch(error){
    res.status(500).json(error);
  }
  
});

//delete a post
router.delete('/:id', async (req,res) => {
  try{
    const post = await Post.findById(req.params.post_id);
    if(post.user_id === req.body.user_id){
      await post.deleteOne();
      res.status(200).json("Your post have been deleted");
    }else{
      res.status(405).json("You can only delete your post.");
    }
  }catch(error){
    res.status(500).json(error);
  }
  
});

//get a post
router.get('/:id', async (req,res) => {
  try{
    const post = await Post.findById(req.params.post_id);
    res.status(200).json(post);
  }catch(error){
    res.status(500).json(error);
  }
});

module.exports = router
