import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
const App = () => {
  const router = createBrowserRouter([
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login /> },
  ]);
  return (
    <>
      {/* <Register /> */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
