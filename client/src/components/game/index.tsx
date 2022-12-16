import React from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  background-color: #282c34;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

export function Game() {
  return (
    <GameContainer>
      <h1>Pososi</h1>
    </GameContainer>
  );
}
