import { Button, Card, Container, Form, ListGroup, Alert, Stack } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getWeatherService } from './services/service';
import { useState, useRef } from 'react';

function App() {
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const [selectedCity, setSelectedCity] = useState({});
  const [cityHistory, setCityHistory] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());
    getWeatherData(formObject.city, formObject.country);
    e.target.reset();
  };

  const getWeatherData = async (city,country) => {
    try {
      const response = await getWeatherService(city, country);
      const newDate = new Date();
      const data = {
        weather: response.weather[0].main,
        temp: response.main.temp.toFixed(0),
        tempHigh: response.main.temp_max.toFixed(0),
        tempLow: response.main.temp_min.toFixed(0),
        humidity: response.main.humidity,
        timeStamp: newDate.toLocaleString(),
        description: response.weather[0].description,
        city: response.name,
        country: response.sys.country
      };
      setSelectedCity(data);
      let newCityHistory;
      if(cityHistory.length > 0){
        newCityHistory = cityHistory.map(x=>x);
        newCityHistory.unshift(data);
      } else {
        newCityHistory = [data];
      }
      setCityHistory(newCityHistory);
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    };
  };

  const clearFields = () => {
    if (inputRef1.current) inputRef1.current.value = "";
    if (inputRef2.current) inputRef2.current.value = "";
  };

  const deleteHistory = (index) => {
    let newCityHistory = cityHistory.map(x=>x);
    newCityHistory.splice(index, 1);
    setCityHistory(newCityHistory);
  }

  return (
    <Container fluid className='backdrop'>
      <Form onSubmit={onSubmit}>
            <Stack direction='horizontal' gap={3}>
              <div>
              <Form.Group controlId='formCity' className='my-3'>
                <Form.Control type="text" name="city" placeholder="City" ref={inputRef1}/>
              </Form.Group>
              </div>
              <div>
              <Form.Group controlId='formCountry'>
                <Form.Control type="text" name="country" placeholder="Country" ref={inputRef2}/>
              </Form.Group>
              </div>
              <div><Button type="submit"><i className="bi bi-search"></i></Button></div>
              <div><Button variant="danger" onClick={clearFields}><i className="bi bi-x-lg"></i></Button></div>
            </Stack>
      </Form>
      <Card>
        <Card.Header>Today's Weather</Card.Header>
          { Object.keys(selectedCity).length > 0 
            ? <Card.Body>
                <Stack direction='horizontal' gap={2}><h1>{selectedCity.weather}</h1><p className='mt-auto'> - {selectedCity.description}</p></Stack> 
                <Stack direction='horizontal'gap={4}><h2>{selectedCity.temp}°C</h2><Stack><h6>H:{selectedCity.tempHigh}°C</h6> <h6>L:{selectedCity.tempLow}°C</h6></Stack></Stack>  
                <Stack><h5>{selectedCity.city}, {selectedCity.country}</h5></Stack>
                <Stack><p>Humidity: {selectedCity.humidity}%</p></Stack>
                <Stack className='text-secondary'>{selectedCity.timeStamp}</Stack>  
              </Card.Body>
            : <Card.Body><h5>-</h5></Card.Body>
          }
        <Card>
          { showError ?
            <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
              <Alert.Heading>{errorMessage}</Alert.Heading>
            </Alert> : ""
          }
        <Card.Header>Search History</Card.Header>
          <ListGroup>
            {cityHistory.length>0 ?
            cityHistory.map((history, index) => {
              return (
                <ListGroup.Item key={index} variant='secondary'>
                  <Stack direction='horizontal' gap={3}>
                    <div>{history.city}, {history.country}</div>
                    <div className='ms-auto'>{history.timeStamp}</div> <div><Button onClick={()=>getWeatherData(history.city, history.country)}><i className="bi bi-search"></i></Button> <Button variant="danger" onClick={()=>deleteHistory(index)}><i className="bi bi-trash"></i></Button></div>
                  </Stack>
                </ListGroup.Item>
              )
            })
            : <Stack direction='horizontal' gap={3}>
                <h5 className='p-3'>No Record Found</h5>
              </Stack>
            }
          </ListGroup>
        </Card>
      </Card>
      
    </Container>
  );
}

export default App;
