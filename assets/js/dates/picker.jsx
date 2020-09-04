import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RDP from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import $ from 'cash-dom';
import { setHours, setMinutes, setSeconds, parse } from 'date-fns';

export function DateTimePicker(props) {
  const [date, setDate] = useState(props.defaultDate);
  return (
    <RDP
      selected={date}
      onChange={(dd) => setDate(dd)}
      dateFormat="yyyy-MM-dd kk:mm"
      showTimeSelect
      timeIntervals={60}
      injectTimes={[
        make_time(23, 59, 59),
      ]}
      {...props}
    />
  );
}

export function replace_date_picker(input) {
  let date0 = new Date();
  let name = input.getAttribute("name");

  let elem = (
    <DatePicker
      name={name}
      className="form-control"
      defaultDate={date0}
    />
  );

  ReactDOM.render(elem, $(input).parent()[0])
}

export function DatePicker(props) {
  const [date, setDate] = useState(props.defaultDate);
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
  let date0 = parse(input.value, "yyyy-MM-dd kk:mm:ss", new Date());
  let name = input.getAttribute("name");

  let elem = (
    <DateTimePicker
      name={name}
      className="form-control"
      defaultDate={date0}
    />
  );
  ReactDOM.render(elem, $(input).parent()[0])
}

function set_time(dd, hh, mm, ss) {
  return setHours(setMinutes(setSeconds(dd, ss), mm), hh);
}

function make_time(hh, mm, ss) {
  return set_time(new Date(), hh, mm, ss);
}
