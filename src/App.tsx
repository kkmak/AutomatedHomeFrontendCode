import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Alert, Box, Button, Card, CardContent, Collapse, Grid, List, ListItem, TextField, Typography } from '@mui/material';
import { memoryUsage } from 'process';


export type SensorListProps = {
  sensors: any[];
  reloadSensors: () => void;
}

function App() {

  const [sensors, setSensors] = useState<any>([]);
  const [sensorName, setSensorName] = useState<string>('');
  const [roomWhereIsIt, setroomWhereIsIt] = useState<string>('');
  const [addName, setAddName] = useState<String>('');
  const [addMiminumValue, setAddMiminumValue] = useState<Number>(0);
  const [addActualValue, setAddActualValue] = useState<Number>(0);
  const [addMaximumValue, setAddMaximumValue] = useState<Number>(0);
  const [addRoomWhereIsIt, setAddRoomWhereIsIt] = useState<String>('');
  const [events, setEvents] = useState<any>([]);
  const [open, setOpen] = React.useState(true);

  const getSensors = () => {
    axios.get('http://localhost:8080/sensors').then((response) => setSensors(response.data));
  }

  const addSensor = () => {
    axios.post('http://localhost:8080/sensors', { "name": addName, "minimumValue": addMiminumValue, "actualValue": addActualValue, "maximumValue": addMaximumValue, "roomWhereIsIt": addRoomWhereIsIt }).then(getSensors);
  }

  const deleteSensor = (sensorId: number) => {
    axios.delete('http://localhost:8080/sensors/' + sensorId).then(getSensors);
  }

  const getEvents = () => {
    axios.get('http://localhost:8080/events').then((response) => setEvents(response.data));
    setOpen(true);
  }



  useEffect(() => { axios.get('http://localhost:8080/sensors').then((response) => setSensors(response.data)) }, []);

  useEffect(() => { axios.get('http://localhost:8080/sensors?name=' + sensorName).then((response) => setSensors(response.data)); }, [sensorName]);

  useEffect(() => { axios.get('http://localhost:8080/sensors?roomWhereIsIt=' + roomWhereIsIt).then((response) => setSensors(response.data)); }, [roomWhereIsIt]);


  return (
    <div className="App">
      <Box sx={({ backgroundColor: 'green', margin: 1 })}>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label='Sensor name' variant='outlined' value={sensorName} onChange={(e) => setSensorName(e.target.value)}></TextField>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label='RoomWhereSensorIs' variant='outlined' value={roomWhereIsIt} onChange={(d) => setroomWhereIsIt(d.target.value)} ></TextField>
      </Box>
      <Card sx={({ backgroundColor: 'yellow', padding: 1.2 })}>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label="Sensor name" value={addName} onChange={(e) => setAddName(e.target.value)}></TextField>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label="Minumum value" value={addMiminumValue} type="number" onChange={(e) => setAddMiminumValue(Number(e.target.value))}></TextField>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label="Actual value" value={addActualValue} type="number" onChange={(e) => setAddActualValue(Number(e.target.value))}></TextField>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label="Maximum value" value={addMaximumValue} type="number" onChange={(e) => setAddMaximumValue(Number(e.target.value))}></TextField>
        <TextField sx={({ backgroundColor: 'antiquewhite' })} label="Room where to be" value={addRoomWhereIsIt} onChange={(e) => setAddRoomWhereIsIt(e.target.value)}></TextField>
        <Button variant='outlined' sx={{ color: 'black', margin: 1, padding: 1, backgroundColor: 'gray' }} onClick={() => addSensor()}>Add Sensor</Button>
      </Card>
      <Card sx={({ margin: 1 })} variant='outlined' >
        <Button sx={{ color: 'black', margin: 1, padding: 1, backgroundColor: 'gray' }} onClick={() => getEvents()}>Get Events</Button>
      </Card>
      {events && events.map((event: any) => <Collapse in={open}> <Alert onClose={() => { setOpen(false) }}>{event.dataSensor}**{event.triggerSensor}</Alert></Collapse>)}
      <List sx={{ width: 1 }}>
        {sensors.map((sensors: any) =>
          <ListItem sx={{ justifyContent: 'center' }}>
            <Card sx={{ width: 0.8 }}>
              <CardContent>
                <Typography variant='h6'>{sensors.name}</Typography>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>MinimumValue: {sensors.minimumValue}</Typography>
                    <Typography>ActualValue: {sensors.actualValue}</Typography>
                    <Typography>MaximumValue: {sensors.maximumValue}</Typography>
                    <Typography>Room Where Sensor Is: {sensors.roomWhereIsIt}</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column ' }}>
                    <Button variant='outlined' sx={{ margin: 1 }}>Edit</Button>
                    <Button variant='outlined' sx={{ margin: 1 }}>Add Entry</Button>
                    <Button variant='outlined' sx={{ color: 'red', margin: 1 }} onClick={() => deleteSensor(sensors.id)}>Delete Sensor</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem >)}
      </List>
    </div >
  );
}

export default App;
