const express=require('express');
const router = express.Router();


// GET api/post
// test route
//public access
router.get('/',(req,res)=>res.send('post works'))

module.exports=router;