import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import request from '../utils/request';
import Snackbar from '@mui/material/Snackbar';
import sty from './register.module.css';

// import { useNavigate } from 'react-router-dom';
export default function Login () {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const Toast = (message) => {
    setOpen(true);
    setMsg(message);
  };
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();
  const handleRegisterSubmit = () => {
    if (email === '') {
      Toast('Email cannot be empty');
      return;
    }
    if (name === '') {
      Toast('Name cannot be empty');
      return;
    }
    if (password !== passwordConfirmation) {
      Toast('The passwords entered twice are inconsistent');
      return;
    }
    request
      .post('/user/auth/register', {
        email,
        name,
        password,
      })
      .then((res) => {
        console.log('res = ', res);
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
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
        }}
        message={msg}
      />
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
            Register
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
                value={name}
                size='small'
                onChange={(e) => {
                  setName(e.target.value);
                }}
                style={{
                  width: '100%',
                }}
                label='Name'
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

            <Grid item xs={12} md={12}>
              <TextField
                required
                value={passwordConfirmation}
                size='small'
                type='password'
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                }}
                style={{
                  width: '100%',
                }}
                label='Password Confirmation'
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
                Register
              </Button>
              <div>
                <Button
                  onClick={() => {
                    navigate('/login');
                  }}
                  variant='text'
                >
                  to login
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
