import "../styles/globals.css";
import { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Login from "../components/Login";
import Loading from "../components/Loading";
import { Provider } from "react-redux";
import store from "../store";
import SideBar from "../components/SideBar";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [logged, setLogged] = useState<boolean>(true);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      setLogged(false);
    }
  }, [user]);

  if (loading) return <Loading />;

  if (!(logged && user))
    return (
      <Provider store={store}>
        <Login setLogged={setLogged} />
      </Provider>
    );

  return (
    <Provider store={store}>
      <div className="flex h-full w-full">
        <SideBar />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
};

export default MyApp;
