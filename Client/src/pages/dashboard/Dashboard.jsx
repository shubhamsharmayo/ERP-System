import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import './dashboard.css';

const apiKey = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const observer = useRef();

  const LIMIT = 10; // Should match backend pagination limit

  // Function to fetch more data
  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await axios.get(`${apiKey}/Create/data?page=${page}&limit=${LIMIT}`);
      
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Fetch total count
  const fetchCount = useCallback(async () => {
    try {
      const res = await axios.get(`${apiKey}/Create/count`);
      setCount(res.data.total);
    } catch (err) {
      console.error("Error fetching count:", err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchMoreData();
    fetchCount();
  }, []);

  // Handle student deletion
  const handleDelete = async (id, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        const response = await axios.delete(`${apiKey}/Create/delete/${id}`);
        
        if (response.data === 'Task deleted') {
          setData((prevData) => prevData.filter((item) => item._id !== id));
          setCount(prevCount => prevCount - 1);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  // Set up the intersection observer for infinite scrolling
  const lastElementRef = useCallback(node => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreData();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, fetchMoreData]);

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          
          <div className="dashboard-actions">
            <h3>Total Students: {count}</h3>
            <NavLink className="loginlink" to="/create">
              <i className="fas fa-plus"></i> Add New Student
            </NavLink>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="table-container">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((student, idx) => (
                  <tr
                    className="table_row"
                    key={student._id || idx}
                    ref={idx === data.length - 1 ? lastElementRef : null}
                  >
                    <td>
                      <Link to={`/student/${student.studentId}`}>
                        {student.studentId}
                      </Link>
                    </td>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.contact}</td>
                    <td className="action-buttons">
                      <Link to={`/edit/${student._id}`}>
                        <button className="edit-btn">Edit</button>
                      </Link>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(student._id, student.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading ? (
          <div className="no-data">
            <p>No students found. Click "Add New Student" to get started.</p>
          </div>
        ) : null}

        {loading && (
          <div className="loading-indicator">
            <span>Loading more students...</span>
          </div>
        )}
        
        {!hasMore && data.length > 0 && (
          <p className="end-message">All students loaded</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;