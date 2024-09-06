import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BillProvider } from "./Context/BillContext.tsx";
import { ProgressProvider } from "./Context/ProgressContext.tsx";
import { Form2ValuesProvider } from "./Context/part2Context.tsx";
import { LastFormContextProvider } from "./Context/lastFormContext.tsx";
import { Form1ValuesProvider } from "./Context/part1Context.tsx";
import { Form3ValuesProvider } from "./Context/part3Context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Form1ValuesProvider>
      <LastFormContextProvider>
        <Form2ValuesProvider>
          <Form3ValuesProvider>
            <ProgressProvider>
              <BillProvider>
                <App />
              </BillProvider>
            </ProgressProvider>
          </Form3ValuesProvider>
        </Form2ValuesProvider>
      </LastFormContextProvider>
    </Form1ValuesProvider>
  </React.StrictMode>
);
