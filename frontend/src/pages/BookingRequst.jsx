import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  ListItemButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import request from '../utils/request';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import sty from './bookingRequest.module.css';

function BookingRequest () {
  const { id } = useParams();
  const [bookList, setBookList] = useState([]);
  const [detail, setDetail] = useState({});

  const getDetail = () => {
    request.get(`/listings/${id}`).then((res) => {
      setDetail(res.listing);
    });
  };

  const getBookList = () => {
    request.get('/bookings').then((res) => {
      console.log('res = ', res);
      setBookList(
        res.bookings.filter((v) => {
          return v.listingId === id;
        })
      );
    });
  };

  const userinfo = useSelector((state) => {
    return state.userinfo;
  });

  useEffect(
    () => {
      if (userinfo) {
        getBookList();
      }
      getDetail();
    },
    [userinfo]
  );
  let allDays = 0;
  let profit = 0;
  bookList.forEach((v) => {
    if (v.status === 'accepted') {
      profit += v.totalPrice;
      allDays += (dayjs(v.dateRange.end).diff(dayjs(v.dateRange.start), 'days') || 1) + 1;
    }
  });

  return (
    <div className={sty.box}>
      <Grid
        style={{
          maxWidth: '1200px',
          margin: '0 auto 50px',
          width: '90%',
        }}
        rowSpacing={2}
        columnSpacing={{
          xs: 0,
          md: 2,
        }}
        container
      >
        <Grid item xs={12} md={12}>
          <Typography
            style={{
              wordBreak: 'break-word',
              margin: '20px 0',
            }}
            component='div'
            variant='h6'
          >
            Booking Request
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>owner</TableCell>
                  <TableCell align='left'>dateRange</TableCell>
                  <TableCell align='left'>totalPrice</TableCell>
                  <TableCell align='left'>status</TableCell>
                  <TableCell align='left'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookList.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {row.owner}
                    </TableCell>
                    <TableCell align='left'>
                      {dayjs(row.dateRange.start).format('MM/DD/YYYY')} -{' '}
                      {dayjs(row.dateRange.end).format('MM/DD/YYYY')}
                    </TableCell>
                    <TableCell align='left'>{row.totalPrice}</TableCell>
                    <TableCell align='left'>{row.status}</TableCell>
                    <TableCell align='left'>
                      {row.status === 'pending' && (
                        <div>
                          <Button
                            onClick={() => {
                              request
                                .put(`/bookings/accept/${row.id}`)
                                .then(() => {
                                  window.Toast('Operation succeeded');
                                  getBookList();
                                });
                            }}
                            style={{
                              marginRight: 10,
                            }}
                            size='small'
                            variant='contained'
                          >
                            accept
                          </Button>
                          <Button
                            onClick={() => {
                              request
                                .put(`/bookings/decline/${row.id}`)
                                .then(() => {
                                  getBookList();
                                  window.Toast('Operation succeeded');
                                });
                            }}
                            size='small'
                            color='error'
                            variant='contained'
                          >
                            deny
                          </Button>
                        </div>
                      )}
                      {row.status !== 'pending' && (
                        <Button
                          onClick={() => {
                            request.delete(`/bookings/${row.id}`).then(() => {
                              getBookList();
                              window.Toast('Operation succeeded');
                            });
                          }}
                          size='small'
                          color='error'
                          variant='contained'
                        >
                          delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography
            style={{
              wordBreak: 'break-word',
              margin: '20px 0 20px',
            }}
            component='div'
            variant='h6'
          >
            Booking History
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>owner</TableCell>
                  <TableCell align='left'>dateRange</TableCell>
                  <TableCell align='left'>totalPrice</TableCell>
                  <TableCell align='left'>status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookList
                  .filter((v) => {
                    return v.status !== 'pending';
                  })
                  .map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component='th' scope='row'>
                        {row.owner}
                      </TableCell>
                      <TableCell align='left'>
                        {dayjs(row.dateRange.start).format('MM/DD/YYYY')} -{' '}
                        {dayjs(row.dateRange.end).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell align='left'>{row.totalPrice}</TableCell>
                      <TableCell align='left'>{row.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary='Online Days'
                  secondary={
                    detail.postedOn
                      ? dayjs(detail?.postedOn).diff(dayjs(), 'days') + 1
                      : 0
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary='Total Booking Days'
                  secondary={allDays}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary='Profit' secondary={profit} />
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
}

export default BookingRequest;
