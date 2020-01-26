const express=require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


// Post api/post
// create a post route
//private access
router.post('/',[auth,[
    check('text','Text is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()})
    }
    const user = await (await User.findById(req.user.id)).select('-password');

    const newPost = {
        text: req.body.text,

    }
});

module.exports=router;