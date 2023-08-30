const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name field is mandatory'],
    },
    email:{
        type: String,
        required: [true, 'Email field is mandatory'],
        unique: true,
    },
    contact:{
        type: String,
        required: [true, 'Contact field is mandatory']
    },
    password:{
        type: String,
        required: [true, 'Password field is mandatory']
    },
},
{
timestamp: true
})

module.exports = mongoose.model('Test', testSchema)