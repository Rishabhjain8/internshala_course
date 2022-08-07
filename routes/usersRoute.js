const express = require('express');
const User = require('../models/user');
const Course = require('../models/course');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/adduser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Userwith this email already exists" })
        }

        user = await User.create({
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
        });

        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.get('/getuser', async (req, res) => {
    try {
        let user = await User.find();
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/enrollcourse/:id', async (req, res) => {
    let courseId = req.params.id;
    let email = req.body.email;

    let user = await User.findOne({ email: email });
    if (!user) {
        return res.send("User is not registered")
    }

    let userId = user._id;
    let previousCourses = user.enrolledCourses;
    let flag = false;
    let dateFlag = false;
    
    let course = await Course.findById(courseId);    
    let courseEnroll = await Course.findByIdAndUpdate(courseId, {
        enrollStudents: [...course.enrollStudents, userId]
    })
        
    previousCourses.forEach(element => {
        if (element.toString() === course.title.toString()) {
            flag = true;
        }
    });

    let now = Date.now();

    if (Date.parse(course.start_date) < now) {
        dateFlag = true;
    }

    if (dateFlag) {
        dateFlag = false;
        return res.send("Sorry now you can't register");
    }

    if (!flag) {
        let userEnroll = await User.findByIdAndUpdate(userId, {
            enrollCourses: [...user.enrollCourses, course.title]
        })
        let updatedUser = await User.findOne({ email: email });

        return await res.send(updatedUser);
    } else {
        flag = false;
        return res.send("You are already enrolled in this course")
    }

})

router.get("/enrollcourseist", async (req, res) => {
    const email = req.body.email;
    let user = await User.findOne({ email: email });
    if (!user) {
        return res.send("Please sign up");
    }

    res.send(user.enrollCourses);
});

module.exports = router;


