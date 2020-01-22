const express=require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');


// GET api/auth
// test route
//public access
router.get('/',auth, async(req,res)=>{

try{
const user = await User.findById(req.user.id).select('-password')
res.json(user)
}catch (err){
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

// Post api/auth
// authentic user and get token
//public access
router.post('/', [

    check('email', 'Please make sure email is valid').isEmail(),
    check('password', 'Password is required to login').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //destructuring req.body
        const {  email, password } = req.body;

        try {

            //see if user exist
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'User does not exists' }] });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid password' }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, config.get('jwtSecret'),
            {expiresIn: 360000},
           (err,token)=>{
            if (err) throw err;
            res.json({token})
           }
            );
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    })

module.exports=router;