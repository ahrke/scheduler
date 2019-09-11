import React from 'react';
import InterviewerListItem from 'components/InterviewerListItem';
import pt from 'prop-types';

import 'components/InterviewerList.scss';

export default function InterviewerList(props) {

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map(interviewer => 
          <InterviewerListItem 
            key={interviewer.id}
            name={interviewer.name}
            avatar={interviewer.avatar}
            selected={props.value === interviewer.id}
            onChange={e => props.onChange(interviewer.id)}
          />
        )}
      </ul>
    </section>
  );
};

InterviewerList.propTypes = {
  value: pt.number,
  onChange: pt.func
};