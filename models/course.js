const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    enrollStudents:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
