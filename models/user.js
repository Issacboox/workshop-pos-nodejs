const mongoose = require('mongoose');

const userRoles = ['ADMIN', 'USER'];
const userStatus = ['Waiting For Approve', 'APPROVED'];

const usersSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    role: { type: String, enum: userRoles, default: 'USER' }, 
    status: { type: String, enum: userStatus, default: 'Waiting For Approve' }, 
},{
    timestamps:true
});

module.exports = mongoose.model('users', usersSchema);
