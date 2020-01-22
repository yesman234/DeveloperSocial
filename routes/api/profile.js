const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');






// GET api/profile/me
// Get current users profile
//private access
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for the user' })
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// POST api/profile/me
// Create or update user profile
//private access

router.post('/', [
    auth, [
        check('status', 'Status is required')
            .not()
            .isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills.split(',').map(skill => skill.trim());
        }

        //build socil object 
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;



        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            //if not then Create a prfile 
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile)

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
        console.log(profileFields.social)
        res.send('you got skillls')
    });



// GET api/profile/me
// Get current users & update profile
//private access

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// GET api/profile/me
// Get current users & update profile by ID
//private access

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            res.status(400).json({ msg: 'there is no Profile' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error');
    }
});

// DELETE api/profile/me
// Delete current users & update profile by ID
//private access

router.delete('/', auth, async (req, res) => {
    try {
        //remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove User
        await Profile.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
        if (!profile) {
            res.status(400).json({ msg: 'there is no Profile' })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// PUT api/profile/me
// PUT current users & update profile by ID
//private access

router.put('/experience', [auth,
    [
        check('title', 'Title is required')
            .not()
            .isEmpty(),
        check('company', 'Company is required')
            .not()
            .isEmpty(),
        check('from', 'From date is required')
            .not()
            .isEmpty(),

    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.errors(err.message)
        res.status(500).send('Server Error')
    }
});


// DELETE api/profile/experience/:id
// DELETE experience from profile
//private access

router.delete('/experience/:exp_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //remove index
        const removeIndex = await profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.errors(err.message)
        res.status(500).send('Server Error')
    }
});

// PUT api/profile/me
// PUT current users & update profile by ID
//private access

router.put('/educaiton', [auth,
    [
        check('school', 'school is required')
            .not()
            .isEmpty(),
        check('degree', 'degree is required')
            .not()
            .isEmpty(),
            check('fieldofstudy', 'fieldofstudy is required')
            .not()
            .isEmpty(),
        check('from', 'From date is required')
            .not()
            .isEmpty(),

    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.errors(err.message)
        res.status(500).send('Server Error')
    }
});


// DELETE api/profile/education/:edu_id
// DELETE education from profile
//private access

router.delete('/education/:edu_id', auth, async (req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //remove index
        const removeIndex = await profile.education.map(item=>item.id).indexOf(req.params.exp_id);

        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);

    } catch (err) {
        console.errors(err.message)
        res.status(500).send('Server Error')
    }
})


module.exports = router;