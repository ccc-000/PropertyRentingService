import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import request from '../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router';
import HostedListings from './HostedListings';
import AllListings from './AllListings';
import CreateHostedListings from './CreateHostedListings';
import EditHostedListings from './EditHostedListings';
import Detail from './Detail';
import BookingRequest from './BookingRequst';

import sty from './home.module.css';

export default function Home () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userinfo = useSelector((state) => {
    return state.userinfo;
  });

  useEffect(() => {
    if (window.localStorage.userinfo) {
      const u = JSON.parse(window.localStorage.userinfo);
      dispatch({
        type: 'UPDATE_USERINFO',
        payload: u,
      });
    }
  }, []);

  return (
    <Box className={sty.box}>
      <Box className={sty.headBox}>
        <Box className={sty.headCenter}>
          <Box className={sty.headLeft}>
            <Box className={sty.navBox}>
              <Link
                color='#ffffff'
                onClick={() => {
                  navigate('/home/allListings');
                }}
              >
                All Listings
              </Link>
              {userinfo && (
                <Link
                  style={{
                    marginLeft: 30,
                  }}
                  onClick={() => {
                    if (!userinfo) {
                      navigate('/');
                      return;
                    }
                    navigate('/home/hostedListings');
                  }}
                  color='#ffffff'
                >
                  Hosted Listings
                </Link>
              )}
            </Box>
          </Box>
          <Box className={sty.headRight}>
            {userinfo && (
              <>
                <span
                  style={{
                    marginRight: 10,
                  }}
                  className={sty.email}
                >
                  {userinfo.email}
                </span>
                <Box
                  onClick={() => {
                    request.post('/user/auth/logout').then((res) => {
                      dispatch({
                        type: 'UPDATE_USERINFO',
                        payload: null,
                      });
                      navigate('/login');
                    });
                  }}
                  className={sty.loginOut}
                >
                  <Link color='#ec296b'>
                    <span id='logout'>Logout</span>
                  </Link>
                </Box>
              </>
            )}
            {!userinfo && (
              <Box
                onClick={() => {
                  navigate('/login');
                }}
                className={sty.loginOut}
              >
                login
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        style={{
          height: 70,
        }}
      />
      {/* main */}
      <Box className={sty.mainBox}>
        <Routes>
          <Route index element={<AllListings />} />
          <Route path='allListings' element={<AllListings />} />
          <Route
            path='createHostedListings'
            element={<CreateHostedListings />}
          />
          <Route
            path='editHostedListings/:id'
            element={<EditHostedListings />}
          />
          <Route path='detail/:id' element={<Detail />} />
          <Route path='bookingRequest/:id' element={<BookingRequest />} />
          <Route path='hostedListings' element={<HostedListings />} />
        </Routes>
      </Box>
    </Box>
  );
}
