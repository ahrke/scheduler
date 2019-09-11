import React, { Fragment } from 'react';
import className from 'classnames';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  let interviewerListItemClass = className("interviewers__item", {
    "interviewers__item--selected": props.selected  
  });

  return (
    <li selected={props.selected} onClick={props.onChange} className={interviewerListItemClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};
