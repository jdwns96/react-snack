import React, { useState } from "react";
import { useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";
import client from "src/libs/axios";
import { useAppDispatch, useAppSelector } from "src/store";
import { setAuth } from "src/store/auth";
// pages
import { routes, authRoutes } from "./routes";

export default function App() {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { id, user_id, name } = useAppSelector((store) => store.auth);

  const [initial, setInitial] = useState<boolean>(false);
  useEffect(() => {
    const authentication = async () => {
      try {
        console.log("initialization");
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) return undefined;

        const response = await client.get("/login-check", {
          headers: {
            refresh: refreshToken,
          },
        });
        console.log(response);
        const { data } = response;
        // axios default header
        client.defaults.headers.authorization = `${data.token.accessToken}`; // access
        localStorage.setItem("refresh", data.token.refreshToken); // refresh
        // global store
        dispatch(
          setAuth({
            id: data.user.id,
            user_id: data.user.user_id,
            name: data.user.name,
          })
        );
      } catch (e) {
        console.log(e);
        // console.log(e.response.status);
      } finally {
        setInitial(true);
      }
    };
    authentication();
  }, []);

  if (!initial) return null;

  return (
    <>
      <Routes location={location} key={location.pathname}>
        {/* {id &&
          authRoutes.map(({ key, path, Component }) => (
            <Route key={key} path={path} element={<Component />} />
          ))} */}
        {routes.map(({ key, path, Component }) => (
          <Route key={key} path={path} element={<Component />} />
        ))}
      </Routes>
    </>
  );
}