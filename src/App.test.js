import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // The app should render the router without errors
  expect(document.body).toBeInTheDocument();
});
