import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

import Button from "@mui/material/Button";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { auth, loginWithEmailAndPassword,registerWithEmailAndPassword } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Login = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            navigate("/home")
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading]);
    
  return (
      <div className={styles.login_root}>
          <h1>{isLogin ? "Login" : "Rigister"}</h1>
          <br />
          <FormControl>
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
                  name="email"
                  label="Email"
                  value={email}
                  onChange={(e) => {
                      setEmail(e.target.value);
                  }}
              />
          </FormControl>
          <br />
          <FormControl>
              <TextField
                  InputLabelProps={{
                      shrink:true,
                  }}
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                  }}
              />
          </FormControl>
          <br />
          <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={
                isLogin
                ? ()=>loginWithEmailAndPassword(email, password)
                : () => registerWithEmailAndPassword(email, password)
                  
              }
          >
              {isLogin ? "Login" : "register"}

          </Button>
          <br />
          <Typography align="center">
              <span onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Create new account ?" : "Back to login"}
              </span>
          </Typography>
      </div>
  )
}

export default Login
