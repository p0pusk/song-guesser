import { calculateNewValue } from "@testing-library/user-event/dist/utils";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../authContext";

export function Auth() {
  const { isAuth, setAuth, login, setLogin, avatar, setAvatar } =
    useContext(authContext);

  const navigation = useNavigate();

  const handleLoginChange = (e: React.ChangeEvent<any>) => {
    const value: string = e.target.value;
    setLogin(value);
  };

  const onSubmit = () => {
    setAuth(true);
    navigation("/home");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="App">
        <header className="App-header">
          <h4>login:</h4>
          <input
            placeholder="login"
            className="App-input"
            value={login ? login : ""}
            onChange={handleLoginChange}
          ></input>
          <div>
            <h4>Select avatar:</h4>
            {avatar && (
              <div>
                <img
                  alt="not fount"
                  width={"50px"}
                  src={URL.createObjectURL(avatar)}
                />
                <br />
                <button onClick={() => setAvatar(null)}>Remove</button>
              </div>
            )}
            <input
              type="file"
              name="myImage"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (!event.target.files) return;
                setAvatar(event.target.files[0]);
              }}
            />
          </div>
          <button className="App-button" type="submit" disabled={!login}>
            Submit
          </button>
        </header>
      </div>
    </form>
  );
}
