import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './studentdetails.css';

const apiKey = import.meta.env.VITE_API_BASE_URL;

const StudentDetail = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiKey}/Create/student/${id}`);
                setStudent(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch student:', err);
                setError('Failed to load student data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchStudent();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await axios.delete(`${apiKey}/Create/delete/${student._id}`);
                
                if (response) {
                    navigate("/");
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student. Please try again.');
            }
        }
    };

    if (loading) return (
        <div className="student-detail-container loading-state">
            <div className="loader"></div>
            <p>Loading student details...</p>
        </div>
    );

    if (error) return (
        <div className="student-detail-container error-state">
            <p className="error-message">{error}</p>
            <button onClick={() => navigate("/")} className="back-btn">
                Back to Dashboard
            </button>
        </div>
    );

    if (!student) return (
        <div className="student-detail-container not-found">
            <p>Student not found.</p>
            <button onClick={() => navigate("/")} className="back-btn">
                Back to Dashboard
            </button>
        </div>
    );

    // Calculate average mark if marks exist
    const marks = student.marks || {};
    const markValues = Object.values(marks);
    const averageMark = markValues.length 
        ? (markValues.reduce((sum, mark) => sum + Number(mark), 0) / markValues.length).toFixed(1) 
        : 'N/A';

    return (
        <div className="student-detail-container">
            <div className="header-section">
                <h2 className="page-title">Student Details</h2>
                <div className="action-buttons">
                    <Link to={`/edit/${student._id}`} className="action-btn">
                        <button className="edit-btn">Edit</button>
                    </Link>
                    <div className="action-btn">
                        <button className="delete-btn" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
            
            <div className="info-section">
                <div className="info-card">
                    <div className="info-row">
                        <div className="info-label">Student ID:</div>
                        <div className="info-value">{student.studentId}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Name:</div>
                        <div className="info-value">{student.name}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Class:</div>
                        <div className="info-value">{student.class}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Contact:</div>
                        <div className="info-value">{student.contact}</div>
                    </div>
                </div>
            </div>
            
            <div className="marks-section">
                <h3 className="marks-title">Academic Performance</h3>
                {markValues.length > 0 ? (
                    <>
                        <div className="average-mark">
                            <span className="avg-label">Average Score:</span>
                            <span className="avg-value">{averageMark}</span>
                        </div>
                        <ul className="marks-list">
                            {Object.entries(marks).map(([subject, score], idx) => (
                                <li key={idx} className="mark-item">
                                    <span className="subject-name">{subject}</span>
                                    <span className="mark-score">{score}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="no-marks">No marks recorded for this student.</p>
                )}
            </div>
            
            <div className="back-section">
                <button onClick={() => navigate("/")} className="back-btn">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default StudentDetail;