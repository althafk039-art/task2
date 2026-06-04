import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function StudyNavbar(props) {
    return (
        <Navbar className={`shadow-sm mb-4 ${props.isDarkMode ? 'bg-dark' : 'bg-primary'}`}>
            <Container fluid>
                <Navbar.Brand className="text-white fw-bold">Pro Study Planner</Navbar.Brand>

                <div className="d-flex gap-3">
                    <button className={`btn btn-sm ${props.isDarkMode ? 'btn-light' : 'btn-dark'}`} onClick={() => props.setIsDarkMode(!props.isDarkMode)}>
                        {props.isDarkMode ? "Light" : "Dark"}
                    </button>
                    <button className="btn btn-sm" onClick={() => props.setIsLoggedIn(false)}>
                        Logout
                    </button>
                </div>
            </Container>
        </Navbar>
    );
}

export default StudyNavbar;