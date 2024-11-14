import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/StudentList.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'https://studentmvc-backend.vercel.app/api/students';

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const saveStudent = async () => {
    try {
      const studentData = { name, age, grade };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, studentData);
      } else {
        await axios.post(API_URL, studentData);
      }
      setName('');
      setAge('');
      setGrade('');
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const editStudent = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setAge(student.age);
    setGrade(student.grade);
  };

  return (
    <div className="container">
      <h2>Student List</h2>
      <p>Total Students: {students.length}</p>
      <div className="input-wrapper">
        <input 
          className="input-field"
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="input-field"
          placeholder="Age" 
          type="number"
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
        <input 
          className="input-field"
          placeholder="Grade" 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)} 
        />
        <button className="add-button" onClick={saveStudent}>
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </div>
      
      {students.map(student => (
        <div key={student._id} className="student-card">
          <div className="student-info">
            <p><strong>{student.name}</strong></p>
            <p>Age: {student.age}</p>
            <p>Grade: {student.grade}</p>
          </div>
          <div className="icon-buttons">
            <button className="icon-button" onClick={() => editStudent(student)}>
              <EditIcon />
            </button>
            <button className="icon-button" onClick={() => deleteStudent(student._id)}>
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentList;
