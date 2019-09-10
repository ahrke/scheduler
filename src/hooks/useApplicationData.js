import React, { useReducer, useEffect } from 'react';
import axios from 'axios';


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return {...state, day: action.value};
    }
    case SET_APPLICATION_DATA: {
      return {...state, days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers}
    }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview } || null
      };
  
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      const days = state.days.map((day) => {
        let spots = day.appointments.map(appointment => state.appointments[appointment]).filter(app => app.interview === null || (app.interview && app.interview.student === undefined)).length

        return {...day, spots}
      });

      return {...state, appointments, days};
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: [],
    interviewers: []
  })

  const setDay = day => dispatch({type: SET_DAY, value: day});

  useEffect(() => {
    const sock = new WebSocket('ws://localhost:3000');
    sock.onopen = () => {
      sock.send("ping")
    }

    sock.onmessage = (message) => {
      console.log("from server:",JSON.parse(message.data))
      const data = JSON.parse(message.data)

      if (data.type === 'SET_INTERVIEW') {
        dispatch({ type: SET_INTERVIEW, id: data.id, interview: data.interview });
      }
    }
  })


  useEffect(() => {
    let source = axios.CancelToken.source();
    
    Promise.all([
      axios.get('/api/days', {
        headers: {'X-Requested-With': 'application/json'},
        cancelToken: source.token
      }),
      axios.get('/api/appointments', {
        headers: {'X-Requested-With': 'application/json'},
        cancelToken: source.token
      }),
      axios.get('/api/interviewers', {
        headers: {'X-Requested-With': 'application/json'},
        cancelToken: source.token
      })
    ]).then((all) => {
      const [days, appointments, interviewers] = all;

      dispatch({ type: SET_APPLICATION_DATA, value: {days: days.data, appointments: appointments.data, interviewers: interviewers.data} })
    })

    return () => {
      source.cancel("cleanup axios")
    }
  }, []);


  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put('/api/appointments/' + id, {
      ...appointment
    })
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: {appointments} });
      })
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    } 

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete('/api/appointments/' + id, {...appointment})
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: {appointments} });
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}