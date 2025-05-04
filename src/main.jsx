import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="656879435486-vkbv326et95m4vf8loht9bordpp8atff.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  // <StrictMode>
  // </StrictMode>
);
