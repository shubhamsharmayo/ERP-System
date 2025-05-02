import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditStudent.css';

const apiKey = import.meta.env.VITE_API_BASE_URL;

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      studentId: '',
      name: '',
      class: '',
      contact: '',
      subjectMarks: [] // Array of {subject, mark} objects
    }
  });

  // Use field array for dynamic subject/mark pairs
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subjectMarks'
  });

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${apiKey}/Create/edit/${id}`);
        const studentData = res.data;
        
        // Basic student info
        const formData = {
          studentId: studentData.studentId,
          name: studentData.name,
          class: studentData.class,
          contact: studentData.contact,
          subjectMarks: []
        };

        // Convert marks object to array of {subject, mark} objects
        if (studentData.marks) {
          formData.subjectMarks = Object.entries(studentData.marks).map(
            ([subject, mark]) => ({ subject, mark })
          );
        }

        reset(formData);
        console.log(id);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };

    fetchStudent();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert subjectMarks array back to marks object
      const marks = {};
      data.subjectMarks.forEach(item => {
        if (item.subject.trim() !== '') {
          marks[item.subject] = item.mark;
        }
      });

      // Replace the array with the object for API submission
      const submissionData = {
        ...data,
        marks,
      };
      delete submissionData.subjectMarks;

      await axios.put(`${apiKey}/Create/update/${id}`, submissionData);
      alert('Student updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="edit-student">
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
        <label>
          Student ID:
          <input {...register('studentId', { required: 'Student ID is required' })} />
          {errors.studentId && <span className="error">{errors.studentId.message}</span>}
        </label>

        <label>
          Name:
          <input {...register('name', { required: 'Name is required' })} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </label>

        <label>
          Class:
          <input {...register('class', { required: 'Class is required' })} />
          {errors.class && <span className="error">{errors.class.message}</span>}
        </label>

        <label>
          Contact:
          <input {...register('contact', { required: 'Contact is required' })} />
          {errors.contact && <span className="error">{errors.contact.message}</span>}
        </label>

        <div className="subjects-section">
          <h3>Subjects and Marks:</h3>
          
          {fields.map((field, index) => (
            <div key={field.id} className="subject-mark-row">
              <input
                placeholder="Subject"
                {...register(`subjectMarks.${index}.subject`, { 
                  required: 'Subject name is required' 
                })}
                className="subject-input"
              />
              
              <input
                type="number"
                placeholder="Mark"
                {...register(`subjectMarks.${index}.mark`, { 
                  required: 'Mark is required',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Mark cannot be negative'
                  },
                  max: {
                    value: 100,
                    message: 'Mark cannot exceed 100'
                  }
                })}
                className="mark-input"
              />
              
              <button 
                type="button" 
                onClick={() => remove(index)}
                className="remove-button"
              >
                Remove
              </button>
              
              {errors.subjectMarks?.[index]?.subject && 
                <span className="error">{errors.subjectMarks[index].subject.message}</span>}
              
              {errors.subjectMarks?.[index]?.mark && 
                <span className="error">{errors.subjectMarks[index].mark.message}</span>}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => append({ subject: '', mark: '' })}
            className="add-subject-button"
          >
            Add Subject
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Updating...' : 'Update Student'}
        </button>
      </form>
    </div>
  );
};

export default EditStudent;