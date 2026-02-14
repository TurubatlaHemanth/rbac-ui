import { SliderValueLabel } from "@mui/material";
import React, { createContext, useState } from "react";

const userContext = createContext();
export default function UserContextExample() {
  const [userName, userState] = useState("raj");
  return (
    <userContext.Provider value={userName}>
      {chilldrenName}
    </userContext.Provider>
  );
}
    