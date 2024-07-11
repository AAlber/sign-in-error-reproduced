import { OTPInput } from "input-otp";
import { useRef } from "react";
import { FakeDash, Slot } from "../popups/confirmation-modal/code-input-opt";
/**
 * OTPInputComponent is a reusable component that renders an OTP input field.
 * @param {Object} props - Component properties.
 * @param {string} props.code - The current code of the OTP input.
 * @param {Function} props.setCode - Function to update the state of the OTP code.
 */

export const OTPInputComponent = ({ code, setCode }) => {
  const formRef = useRef(null);
  return (
    <OTPInput
      value={code}
      autoFocus
      onChange={setCode}
      maxLength={6}
      containerClassName="group flex items-center has-[:disabled]:opacity-30"
      render={({ slots }) => (
        <>
          <div className="flex ">
            {slots.slice(0, 3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>

          <FakeDash />

          <div className="flex">
            {slots.slice(3).map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
};
