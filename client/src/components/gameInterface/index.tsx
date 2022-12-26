import React, { useContext, useState } from "react";
import styled from "styled-components";
import lobbyContext from "../../lobbyContext";
import socketService from "../../services/socketService";

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 5% 5% 5% 5%;
  margin-top: 2%;
  border: 1px solid #222222;
  border-radius: 5px;
  display: flex;
  background-color: white;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
`;

const FormButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

export function GameInterface() {
  const { isSelecting, setSelecting, setReady } = useContext(lobbyContext);
  const [url, setUrl] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUrlChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setUrl(value);
  };

  const handleAnswerChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setAnswer(value);
  };

  const submitSong = (e: React.FormEvent) => {
    e.preventDefault();
    setSelecting(false);
    setReady(true);
    socketService.socket?.emit("ready");
  };

  return (
    <form onSubmit={submitSong}>
      <FormContainer>
        <h1>Guess the song</h1>
        <FormInput
          value={url}
          onChange={handleUrlChange}
          placeholder="song url"
        />
        <FormInput
          value={answer}
          onChange={handleAnswerChange}
          placeholder="answer"
        />
        <FormButton type="submit">Submit</FormButton>
      </FormContainer>
    </form>
  );
}
