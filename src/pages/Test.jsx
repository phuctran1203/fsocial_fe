import React, { useState } from "react";
import InputOTP4Digit from "@/components/inputOTP4Digit";
export default function Test() {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  return (
    <div className="h-screen grid place-content-center">
      <InputOTP4Digit value={value1} setValue={setValue1} autoFocus={true} />
    </div>
  );
}
