import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddStudents.css';

const apiKey = import.meta.env.VITE_API_BASE_URL;


const AddStudents = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [marks, setMarks] = useState({});
    const [subject, setSubject] = useState('');
    const [mark, setMark] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [markError, setMarkError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [warning, setwarning] = useState("")

    const navigate = useNavigate();

useEffect(() => {
console.log(apiKey)
}, [])

    const validateSubjectMark = () => {
        let isValid = true;
        
        setSubjectError('');
        setMarkError('');
        
        if (!subject.trim()) {
            setSubjectError('Subject name is required');
            isValid = false;
        } else if (marks[subject]) {
            setSubjectError('Subject already exists');
            isValid = false;
        }
        
        if (!mark) {
            setMarkError('Mark is required');
            isValid = false;
        } else if (Number(mark) < 0 || Number(mark) > 100) {
            setMarkError('Mark must be between 0 and 100');
            isValid = false;
        }
        
        return isValid;
    };

    const handleAddMark = () => {
        if (validateSubjectMark()) {
            setMarks((prev) => ({ ...prev, [subject]: Number(mark) }));
            setSubject('');
            setMark('');
        }
    };

    const removeSubject = (subjectToRemove) => {
        const updatedMarks = { ...marks };
        delete updatedMarks[subjectToRemove];
        setMarks(updatedMarks);
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            const finalData = { 
                id: data.id,
                name: data.name,
                contact: data.contact,
                classs: data.classs,
                marks 
            };
            
            const response = await axios.post(`${apiKey}/Create/create`, finalData);
            
            if (response.data=="taken") {
                console.log(response.data)
                setwarning("studentID already registered")
            }else{
                console.log(response.data)
                reset();
                setMarks({});
                navigate('/');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h1 className="form-title">Add New Student</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="student-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="studentId">Student ID</label>
                            <input
                                id="studentId"
                                {...register('id', { required: 'Student ID is required' })}
                                placeholder="Enter student ID"
                            />
                            {warning?<p className='error-message'>{warning}</p>:""}
                            {errors.studentId && <p className="error-message">{errors.studentId.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                {...register('name', { required: 'Name is required' })}
                                placeholder="Enter student name"
                            />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact">Contact</label>
                            <input
                                id="contact"
                                {...register('contact', { required: 'Contact is required' })}
                                placeholder="Enter contact number"
                            />
                            {errors.contact && <p className="error-message">{errors.contact.message}</p>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="class">Class</label>
                            <input
                                id="class"
                                {...register('classs', { required: 'Class is required' })}
                                placeholder="Enter class"
                            />
                            {errors.class && <p className="error-message">{errors.class.message}</p>}
                        </div>
                    </div>

                    <div className="marks-section">
                        <h2 className="section-title">Add Subject Marks</h2>
                        
                        <div className="subject-mark-inputs">
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Mathematics"
                                />
                                {subjectError && <p className="error-message">{subjectError}</p>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="mark">Mark</label>
                                <input
                                    id="mark"
                                    type="number"
                                    value={mark}
                                    onChange={(e) => setMark(e.target.value)}
                                    placeholder="0-100"
                                    min="0"
                                    max="100"
                                />
                                {markError && <p className="error-message">{markError}</p>}
                            </div>

                            <button 
                                type="button" 
                                className="add-btn" 
                                onClick={handleAddMark}
                            >
                                Add Subject
                            </button>
                        </div>

                        {Object.keys(marks).length > 0 ? (
                            <div className="marks-list-container">
                                <h3 className="marks-title">Added Subjects</h3>
                                <ul className="marks-list">
                                    {Object.entries(marks).map(([sub, m]) => (
                                        <li key={sub} className="mark-item">
                                            <div className="mark-item-content">
                                                <span className="subject-name">{sub}</span>
                                                <span className="mark-value">{m}</span>
                                            </div>
                                            <button 
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeSubject(sub)}
                                                title="Remove subject"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="no-marks-message">No subjects added yet</p>
                        )}
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudents;