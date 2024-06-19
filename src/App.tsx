import { createGlobalStyle } from "styled-components";
import Home from "./routes/home";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-size: 16px;
    font-family: 'Pretendard-Regular';
  }

  body {
    margin: 0;
 }

  canvas {
    margin: 0;
    padding: 0;
  }

  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  } 
`;

function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
