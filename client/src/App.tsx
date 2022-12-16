import { useEffect, useState } from "react";
import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import socketService from "./services/socketService";
import { Game } from "./components/game";
import { Collections } from "./components/collections";
import { Home } from "./components/home";

function App() {
  const connectSocket = async () => {
    const socket = socketService
      .connect("http://localhost:8000")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  const navigation = useNavigate();

  useEffect(() => {
    connectSocket();
    navigation("/home");
  }, []);

  return (
    <Routes>
      <Route path="/lobby=:lobbyID" element={<Game />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
