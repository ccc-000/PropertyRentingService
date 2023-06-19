import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import request from '../utils/request';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import sty from './login.module.css';
export default function Login () {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleRegisterSubmit = () => {
    if (email === '') {
      window.Toast('Email cannot be empty');
      return;
    }
    if (password === '') {
      window.Toast('Password cannot be empty');
      return;
    }
    request
      .post('/user/auth/login', {
        email,
        password,
      })
      .then((res) => {
        dispatch({
          type: 'UPDATE_USERINFO',
          payload: {
            token: res.token,
            email,
          },
        });
        navigate('/');
      });
  };

  return (
    <Box className={sty.box}>
      <Box className={sty.formBox}>
        <Box className={sty.registerBox}>
          <Typography
            variant='h6'
            gutterBottom
            style={{
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Login
          </Typography>

          <Grid rowSpacing={2} container>
            <Grid item xs={12} md={12}>
              <TextField
                value={email}
                size='small'
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                style={{
                  width: '100%',
                }}
                label='Email'
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                value={password}
                size='small'
                type='password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{
                  width: '100%',
                }}
                label='Password'
                required
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
              style={{
                textAlign: 'center',
              }}
            >
              <Button onClick={handleRegisterSubmit} variant='contained'>
                Login
              </Button>
              <div>
                <Button
                  onClick={() => {
                    navigate('/register');
                  }}
                  variant='text'
                >
                  to resister
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
