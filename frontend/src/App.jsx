import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Import your custom components
import StudyLoginPage from './StudyLoginPage';
import StudyNavbar from './StudyNavbar';
import TaskCard from './TaskCard';

function App() {
  // Global States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);

  // States for creating a new task form
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [taskDetails, setTaskDetails] = useState("");

  // Backend Base URL
  const API_URL = 'http://localhost:3000';

  // Fetch tasks from the backend when the user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task handler
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!subject || !deadline || !taskDetails) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        subject,
        deadline,
        taskDetails
      });
      
      if (response.status === 201 || response.status === 200) {
        // Refresh the task list or update state locally
        setTasks([...tasks, response.data.task || { subject, deadline, taskDetails, _id: response.data._id }]);
        // Reset form
        setSubject("");
        setDeadline("");
        setTaskDetails("");
      }
    } catch (error) {
      alert("Failed to add task");
    }
  };

  // Delete/Complete task handler
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      // Filter out the deleted task from frontend state
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      alert("Failed to mark task as done");
    }
  };

  // Conditional Rendering: If not logged in, show login page exclusively
  if (!isLoggedIn) {
    return <StudyLoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className={isDarkMode ? 'bg-dark min-vh-100 text-light' : 'bg-light min-vh-100 text-dark'} style={{ transition: 'all 0.3s' }}>
      
      {/* Navbar Passing Global Props */}
      <StudyNavbar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        setIsLoggedIn={setIsLoggedIn} 
      />

      <Container className="py-4">
        <Row>
          {/* Left Column: Form to create a new task */}
          <Col md={4} className="mb-4">
            <div className={`p-4 rounded shadow-sm border ${isDarkMode ? 'bg-secondary border-light text-white' : 'bg-white'}`}>
              <h4 className="mb-3 fw-bold">Create New Task</h4>
              <form onSubmit={handleAddTask}>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="e.g., Mathematics" 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Details</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={taskDetails} 
                    onChange={(e) => setTaskDetails(e.target.value)} 
                    placeholder="Describe what you need to study..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">Add Task</button>
              </form>
            </div>
          </Col>

          {/* Right Column: Display Tasks Dashboard Grid */}
          <Col md={8}>
            <h3 className="mb-4 fw-bold">Your Study Tasks</h3>
            {tasks.length === 0 ? (
              <div className="text-muted italic-text p-4 border rounded text-center">
                No tasks available. Add some tasks on the left to get started!
              </div>
            ) : (
              <Row xs={1} sm={2} className="g-3">
                {tasks.map((task) => (
                  <Col key={task._id} className="d-flex justify-content-center">
                    <TaskCard
                      subject={task.subject}
                      deadline={task.deadline}
                      taskDetails={task.taskDetails}
                      isDarkMode={isDarkMode}
                      // Pass the delete function targeting this specific task ID
                      deleteTask={() => handleDeleteTask(task._id)} 
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
// Inside App.jsx -> Update fetchTasks
const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token'); // <-- Add this
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` } // <-- Add this header configuration
    });
    setTasks(response.data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Inside App.jsx -> Update handleAddTask
const handleAddTask = async (e) => {
  e.preventDefault();
  if (!subject || !deadline || !taskDetails) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const token = localStorage.getItem('token'); // <-- Add this
    const response = await axios.post(`${API_URL}/tasks`, 
      { subject, deadline, taskDetails },
      { headers: { Authorization: `Bearer ${token}` } } // <-- Add this header configuration
    );
    
    if (response.status === 201 || response.status === 200) {
      setTasks([...tasks, response.data]);
      setSubject("");
      setDeadline("");
      setTaskDetails("");
    }
  } catch (error) {
    alert("Failed to add task");
  }
};

export default App;