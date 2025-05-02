import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { StudentDetails } from "../models/studentModel.js";

const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post("/create", async (req, res) => {
  console.log(req.body);
  const { id, name, contact, classs, marks } = req.body;
  const found = await StudentDetails.findOne({studentId:req.body.id})
  if(found){
    res.json("taken")
  }else{
    const student = new StudentDetails({
        studentId: id,
        name: name,
        class: classs,
        contact: contact,
        marks: marks,
      });
      await student.save();
      res.json(student);
  }
  
});

router.get("/data", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // current page number (default 1)
  const limit = parseInt(req.query.limit) || 10; // number of records per page (default 10)

  const skip = (page - 1) * limit; // how many records to skip

  try {
    const student_data = await StudentDetails.find()
      .skip(skip) // skip already loaded records
      .limit(limit); // return only 'limit' number of records

    res.json(student_data); // send back paginated data
  } catch (error) {
    res.status(500).json({ error: "Error fetching paginated data" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const total = await StudentDetails.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: "Error counting documents" });
  }
});

router.get("/student/:id", async (req, res) => {
  const student = await StudentDetails.findOne({ studentId: req.params.id });
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

router.delete("/delete/:id",async(req,res)=>{
    console.log(req.params.id)
    try {
        const taskid = await StudentDetails.findByIdAndDelete(req.params.id);
        if (!taskid) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        // res.redirect('/:user')
        res.json('Task deleted');
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }


})
//for editing
router.get("/edit/:id", async (req, res) => {
    const student = await StudentDetails.findById(req.params.id);
    res.json(student);
  });


  router.put("/update/:id", async (req, res) => {
    try {
      const updated = await StudentDetails.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(500).send("Error updating student");
    }
  });
export default router;
