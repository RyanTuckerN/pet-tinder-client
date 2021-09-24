import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import Auth from "./components/Auth/Auth";
import MainLayout from "./components/MainLayout";
// import CreateProfile from "./components/Profile/CreateProfile";
// import NotConnected from './components/MainLayoutComponents/NotConnected'
import jwt_decode from "jwt-decode";
import theme from "./components/Theme";
import { ThemeProvider } from '@material-ui/styles';
import API_URL from "./components/_helpers/environment";

function App() {
  //STATE VARIABLE AND SETTERS
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState(null);
  const [usersInfo, setUsersInfo] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [token, setToken] = useState("");

  //LOGGING IN AND SIGNING UP
  const updateToken = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  //LOGGING OUT
  const clearToken = () => {
    setToken("");
    setUsersInfo({});
    setOnlineUsers(null);
    setSocket(null);
    setUserId(null);
    localStorage.clear();
  };

  //LOOKING FOR TOKEN IN LOCAL STORAGE WHEN APP LOADS
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  //DECODING THE TOKEN IF IT EXISTS
  useEffect(() => {
    if (token && localStorage.getItem("token") !== undefined) {
      setUserId(jwt_decode(token).id);
    }
  }, [token]);

  //OPENING A NEW SOCKET FOR CHAT AND REAL-TIME FEATURES
  useEffect(() => {
    const newSocket = io(`${API_URL}`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket, userId]);

  //EMITTING AND CAPTURING SOCKET EVENTS
  useEffect(() => {
    if (token && userId && socket) {
      socket.emit("newLogin", userId);
      socket.on("userCreated", (obj) => {
        setUsersInfo({ ...usersInfo, matches: obj.matches, user: obj.user });
        console.log("💎 USER/MATCHES: ", obj);
        console.log("🔧 SOCKET ID: ", socket.id);
      });
      socket.on("newUser", (socketIds) => {
        setOnlineUsers(socketIds);
        console.log("ONLINE USERS SOCKETS: ", socketIds.mobileSockets);
      });
      socket.on('matchUpdate', obj=>{
        console.log('COMMAND YOU TO ->', obj.message)
        socket.emit('newLogin', userId)
      })
      socket.on('matchResponse', matches=>{
        console.log('matchRESPONSE!', matches)
      })
      socket.on('notificationResponse', notifications=>{
        console.log('📓📓📓📓📓',notifications)
        setNotifications(notifications)
      })
    } 
  }, [socket, token, userId]);

  //FETCHING NOTIFICATIONS
  useEffect(() => {
    const notificationsFetch = async () => {
      const response = await fetch(`http://localhost:3333/note/`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        }),
      });
      const notificationsJson = await response.json();
      console.log(notificationsJson.notifications);
      setNotifications(notificationsJson.notifications)
    };
    notificationsFetch();
  }, [usersInfo?.matches]);

  //PROPS OBJECT
  const mainLayoutProps = {
    socket,
    token,
    usersInfo,
    onlineUsers,
    notifications,
    setNotifications,
    setUsersInfo,
    setOnlineUsers,
    clearToken,
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {token ? (
          <MainLayout mainLayoutProps={mainLayoutProps} />
        ) : (
          <Auth
            setUsersInfo={setUsersInfo}
            updateToken={updateToken}
            usersInfo={usersInfo}
            socket={socket}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
