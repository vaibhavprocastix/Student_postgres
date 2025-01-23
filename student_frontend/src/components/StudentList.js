import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Fetch students from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/students`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  // Add a new student
  const addStudent = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/students`, {
        name,
        age,
      })
      .then((response) => {
        console.log("Student added successfully:", response.data);
        setStudents([...students, response.data]);
        setName("");
        setAge("");
      })
      .catch((err) => {
        console.error("Error adding student:", err);
      });
  };

  //delete a student
  const deleteStudent = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/${id}`)
      .then((response) => {
        console.log("Student deleted successfully:", response.data);
        setStudents(students.filter((student) => student.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Student List
        </h1>
        <ul className="divide-y divide-gray-200 mb-8">
          {students.map((student) => (
            <li
              key={student.id}
              className="py-4 flex justify-between items-center"
            >
              <span className="text-lg font-medium text-gray-700 w-1/3 text-left">
                {student.name}
              </span>
              <span className="text-sm text-gray-500 mt-1 w-1/3 text-center">
                {student.age} years old
              </span>
              <button
                onClick={() => deleteStudent(student.id)}
                className="text-red-500 hover:text-red-700 transition duration-200 w-1/3 text-right"
              >
                delete
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Student
        </h2>
        <form
          onSubmit={addStudent}
          className="bg-gray-50 p-4 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter student age"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentList;
