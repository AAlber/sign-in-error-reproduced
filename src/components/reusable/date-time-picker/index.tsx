import { DatePicker } from "./date-picker";

export default function DateTimePicker(props) {
  return (
    <>
      <DatePicker
        placeholder={props.placeholder}
        onChange={props.onChange}
        showTime={props.showTime}
        date={props.value}
        resetDateButton={props.resetDateButton}
        responsiveFormat={props.responsiveFormat}
      />
    </>
  );
}
