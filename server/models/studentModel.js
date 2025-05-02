// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: String,
  class:String,
  contact:Number,
  marks: {
    type: Map,
    of: Number, // subjects and marks
  },

});

export const StudentDetails =  mongoose.model('StudentDets', studentSchema);
