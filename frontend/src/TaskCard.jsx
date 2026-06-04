import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function TaskCard(props) {
  return (
    <Card
      style={{ width: '18rem' }}
      className={`shadow-sm mb-3 ${props.isDarkMode  ? 'bg-secondary text-light border-light'  : 'bg-white border-dark' }`}>
      <Card.Header className={`fw-bold ${ props.isDarkMode? 'bg-dark text-light': 'bg-primary text-white' }`} >
        {props.subject}
      </Card.Header>
      <Card.Body>
        <Card.Title className={ props.isDarkMode ? 'text-warning fs-6' : 'text-danger fs-6'} >
          Due: {props.deadline}
        </Card.Title>
        <Card.Text>{props.taskDetails}</Card.Text>
        <Button variant="success" className="w-100" onClick={props.deleteTask}>
          Mark as Done 
        </Button>
      </Card.Body>
    </Card>
  );
}
export default TaskCard;