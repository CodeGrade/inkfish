import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RDP from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import $ from 'cash-dom';
import { setHours, setMinutes, addDays } from 'date-fns';




export function DueDatePicker(props) {
  const [date, setDate] = useState(props.defaultDate);
  return (
    <RDP
      selected={date}
      onChange={(dd) => setDate(dd)}
      dateFormat="MMMM d, yyyy h:mm aa O"
      showTimeSelect
      timeIntervals={60}
      injectTimes={[
        make_time(23, 59),
      ]}
      {...props}
    />
  );
}

export function replace_date_picker(input) {
  let date0 = new Date();

  let elem = (
    <DueDatePicker
      className="form-control"
      defaultDate={date0}
    />
  );

  ReactDOM.render(elem, $(input).parent()[0])
}

export function StartDatePicker(props) {
  return (
    <RDP
      selected={date}
      onChange={(dd) => setDate(dd)}
      dateFormat="yyyy MMMM d"
      {...props}
    />
  );
}

export function replace_date_time_picker(input) {
  let elem = (
    <DateTimePicker
      className="form-control"
      defaultDate={date0}
    />
  );
  ReactDOM.render(elem, $(input).parent()[0])
}

function set_time(dd, hh, mm) {
  return setHours(setMinutes(dd, mm), hh);
}

function make_time(hh, mm) {
  return set_time(new Date(), hh, mm);
}
