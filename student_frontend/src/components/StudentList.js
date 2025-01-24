import React, { useEffect, useState } from "react";
import axios from "axios";
import SkeletonLoader from "./SkeletonLoader";
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [bload, setBload] = useState(true);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(null);
  // Fetch students from backend
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/students`)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, []);

  // Add a new student
  const handleSubmit = (e) => {
    e.preventDefault();
    setBload(false);

    const studentData = { name, age };
    if (edit) {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/students/${edit}`,
          studentData
        )
        .then((response) => {
          console.log("Student updated successfully:", response.data);
          setStudents(
            students.map((student) =>
              student.id === edit ? response.data : student
            )
          );
          resetForm();
        })
        .catch((err) => {
          console.error("Error updating students:", err);
          setError("Failed to updated students.Please try again.");
        })
        .finally(() => {
          setBload(true);
        });
    } else {
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
          setError("Failed to add student. Please try again.");
        })
        .finally(() => {
          setBload(true);
        });
    }
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setEdit(null);
  };

  const editStudent = (student) => {
    setEdit(student.id);
    setName(student.name);
    setAge(student.age);
  };

  const dismissError = () => {
    setError("");
  };

  //delete a student
  const deleteStudent = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/students/${id}`)
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
        {loading ? (
          <SkeletonLoader />
        ) : (
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
                <div className="flex space-x-4 w-1/3 justify-end">
                  <button
                    onClick={() => editStudent(student)}
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {edit ? "Edit Student" : "Add Student"}
        </h2>
        <form
          onSubmit={handleSubmit}
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
              required
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
              required
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className={`w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 ${
              !bload ? "cursor-not-allowed opacity-75" : ""
            }`}
            disabled={!bload}
          >
            {!bload ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {bload ? (edit ? "Update Student" : "Add Student") : ""}
          </button>
          {edit && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Error Popup */}
        {error && (
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-black bg-opacity-50 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Error</h3>
              <p className="text-gray-700 mb-4">{error}</p>
              <button
                onClick={dismissError}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
