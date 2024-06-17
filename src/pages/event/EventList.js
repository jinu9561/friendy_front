import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = () => {

    const [events, setEvents] = useState([]);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:9000/eventlist');
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching the event list:', error);
        }
      };
      fetchEvents();
  }, []);


    return (
        <div>
            <h1>이벤트 테스트</h1>
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.name} - {event.regDate}</li>
          ))}
        </ul>
        </div>
    );
};

export default EventList;