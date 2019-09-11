export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) return [];
  if (state.days.filter(d => d.name === day).length === 0) return [];

  return state.days.filter(dayIn => dayIn.name === day)[0].appointments.map(id => state.appointments[id]);
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) return [];
  const currDay = state.days.filter(dayIn => dayIn.name === day)
  if (currDay.length === 0) return [];

  const interviewerIds = state.days.filter(dayIn => dayIn.name === day)[0].interviewers

  return interviewerIds.map(id => state.interviewers[id]);
};

export function getInterview(state, interview) {
  if (!interview) return null;

  const student = interview.student;
  const interviewer = state.interviewers[interview.interviewer];
  return {
    student,
    interviewer
  }
};

