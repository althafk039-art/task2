
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import StudyLoginPage from './StudyLoginPage';
import StudyNavbar from './StudyNavbar';
import TaskCard from './TaskCard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskDetails, setTaskDetails] = useState('');

  const API_URL = 'https://taskplaner-nhst.onrender.com';

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
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!subject || !deadline || !taskDetails) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        subject,
        deadline,
        taskDetails,
      });

      if (response.status === 201 || response.status === 200) {
        setTasks([...tasks, response.data]);

        setSubject('');
        setDeadline('');
        setTaskDetails('');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete task');
    }
  };

  if (!isLoggedIn) {
    return <StudyLoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div
      className={
        isDarkMode
          ? 'bg-dark min-vh-100 text-light'
          : 'bg-light min-vh-100 text-dark'
      }
      style={{ transition: 'all 0.3s' }}
    >
      <StudyNavbar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Container className="py-4">
        <Row>
          <Col md={4} className="mb-4">
            <div
              className={`p-4 rounded shadow-sm border ${
                isDarkMode
                  ? 'bg-secondary border-light text-white'
                  : 'bg-white'
              }`}
            >
              <h4 className="mb-3 fw-bold">Create New Task</h4>

              <form onSubmit={handleAddTask}>
                <div className="mb-3">
                  <label className="form-label">Subject</label>

                  <input
                    type="text"
                    className="form-control"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
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
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                >
                  Add Task
                </button>
              </form>
            </div>
          </Col>

          <Col md={8}>
            <h3 className="mb-4 fw-bold">Your Study Tasks</h3>

            {tasks.length === 0 ? (
              <div className="text-muted p-4 border rounded text-center">
                No tasks available. Add some tasks on the left to get started!
              </div>
            ) : (
              <Row xs={1} sm={2} className="g-3">
                {tasks.map((task) => (
                  <Col
                    key={task._id}
                    className="d-flex justify-content-center"
                  >
                    <TaskCard
                      subject={task.subject}
                      deadline={task.deadline}
                      taskDetails={task.taskDetails}
                      isDarkMode={isDarkMode}
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

export default App;

