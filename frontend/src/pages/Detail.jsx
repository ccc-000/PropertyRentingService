import React, { useState, useEffect } from 'react';
import {
  ImageList,
  ImageListItem,
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Rating,
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
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { useSearchParams, useParams } from 'react-router-dom';
import sty from './detail.module.css';

function Detail () {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const [detail, setDetail] = useState({});
  const [curBookItem, setCurBookItem] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [days, setDays] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [comment, setComment] = useState('');
  const [ratingsScore, setRatingsScore] = useState(0);
  const [bookList, setBookList] = useState([]);

  const getBookList = () => {
    request.get('/bookings').then((res) => {
      console.log('res1 = ', res);
      setBookList(
        res.bookings.filter((v) => {
          return v.owner === userinfo.email;
        })
      );
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const userinfo = useSelector((state) => {
    return state.userinfo;
  });
  const getDetail = () => {
    request.get(`/listings/${id}`).then((res) => {
      //   console.log('res.listing = ', res.listing);
      setDetail(res.listing);
    });
  };
  useEffect(() => {
    getDetail();
  }, []);
  useEffect(
    () => {
      if (userinfo) {
        getBookList();
      }
    },
    [userinfo]
  );
  useEffect(
    () => {
      if (start && end) {
        setDays(dayjs(end).diff(dayjs(start), 'days') + 1);
        setDateRange([dayjs(start), dayjs(end)]);
      }
    },
    [start, end]
  );
  let score = 0;
  if (detail.reviews) {
    detail?.reviews.forEach((v) => {
      score += v.score;
    });
    score = score / detail.reviews.length;
  }
  let beds = 0;
  if (detail?.metadata?.bedrooms) {
    detail?.metadata?.bedrooms.forEach((v) => {
      beds += Number(v.bedsNumber);
    });
  }
  return (
    <div className={sty.box}>
      <Dialog
        open={open2}
        onClose={() => {
          setOpen2(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Publish Comment</DialogTitle>
        <DialogContent>
          <Grid rowSpacing={2} container>
            <Grid item xs={12} md={12}>
              <TextField
                value={comment}
                size='small'
                multiline
                rows={2}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                style={{
                  width: '100%',
                  marginTop: 20,
                }}
                label='Title'
                required
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Rating
                name='simple-controlled'
                value={ratingsScore}
                onChange={(event, newValue) => {
                  setRatingsScore(newValue);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen2(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              request
                .put(`/listings/${id}/review/${curBookItem.id}`, {
                  review: {
                    score: ratingsScore,
                    comment,
                    email: userinfo.email,
                  },
                })
                .then(() => {
                  window.Toast('Submitted successfully');
                  getDetail();
                  setOpen2(false);
                });
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {'Appointment confirmation'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {`You will make a reservation for ${days} days, from ${dayjs(
              dateRange[0]
            ).format('MM/DD/YYYY')} to ${dayjs(dateRange[1]).format(
              'MM/DD/YYYY'
            )} at a total price of $${days * detail.price}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              request
                .post(`/bookings/new/${id}`, {
                  dateRange: {
                    start: dateRange[0].format('MM/DD/YYYY'),
                    end: dateRange[1].format('MM/DD/YYYY'),
                  },
                  totalPrice: days * detail.price,
                })
                .then(() => {
                  window.Toast('Submitted successfully');
                  getBookList();
                  handleClose();
                });
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
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
        <Grid item xs={12} md={6}>
          <ImageList sx={{ width: '100%' }} cols={1}>
            <ImageListItem>
              <img src={detail.thumbnail} loading='lazy' />
            </ImageListItem>
          </ImageList>
          <ImageList sx={{ width: '100%' }} cols={2}>
            {detail?.metadata?.images.map((item) => (
              <ImageListItem key={item}>
                <img src={item} loading='lazy' />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            style={{
              wordBreak: 'break-word',
              margin: '3px 0',
            }}
            component='div'
            variant='h4'
          >
            {detail?.title}
          </Typography>
          <div
            style={{
              fontSize: 18,
              color: '#1890ff',
            }}
          >
            {detail?.metadata?.type} · {detail?.metadata?.bathroomsNumber}{' '}
            bathrooms · {detail?.metadata?.bedrooms.length} bedrooms · {beds}{' '}
            beds
          </div>
          <Typography variant='body2' color='text.secondary'>
            {days
              ? `$${detail?.price * days}/per stay`
              : `$${detail?.price}/per night`}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {detail?.address}
          </Typography>
          <div
            style={{
              display: 'flex',
              margin: '15px 0',
            }}
          >
            {detail?.metadata?.amenities.map((v) => {
              return (
                <div
                  key={v}
                  style={{
                    background: '#1890ff',
                    color: '#fff',
                    fontSize: 12,
                    borderRadius: 5,
                    marginRight: 5,
                    padding: '3px 8px',
                  }}
                >
                  {v}
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 5,
            }}
          >
            <Rating
              precision={0.1}
              size='small'
              name='read-only'
              value={score}
              readOnly
            />
            <span
              style={{
                fontSize: 18,
                color: '#666',
                marginLeft: 5,
              }}
            >
              {score} · {detail?.reviews?.length} people
            </span>
          </div>

          <div className={sty.cardBox}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={{ start: 'Start', end: 'End' }}
            >
              <DateRangePicker
                value={dateRange}
                disablePast
                shouldDisableDate={(curDate) => {
                  //   console.log('curDate = ', curDate);
                  if (detail.availability) {
                    const availabilityArr = detail.availability;
                    let b = false;
                    for (let k = 0; k < availabilityArr.length; k++) {
                      const kItem = availabilityArr[k];
                      if (
                        dayjs(curDate).diff(dayjs(kItem.start), 'days') >= 0 &&
                        dayjs(curDate).diff(dayjs(kItem.end), 'days') <= 0
                      ) {
                        b = true;
                        break;
                      }
                    }
                    return !b;
                  }
                  return true;
                }}
                onChange={(newValue) => {
                  setDays(
                    dayjs(newValue[1]).diff(dayjs(newValue[0]), 'days') + 1
                  );
                  setDateRange(newValue);
                }}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField size='small' {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField size='small' {...endProps} />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <div
                style={{
                  color: '#666',
                }}
              >
                ${detail.price} x {days} nights
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                }}
              >
                ${detail.price * days}
              </div>
            </div>
            <Button
              fullWidth
              style={{
                marginTop: 30,
              }}
              onClick={() => {
                if (!userinfo) {
                  window.Toast('Please login first');
                  return;
                }
                if (!dateRange[0] && !dateRange[1]) {
                  window.Toast('Please select a date');
                  return;
                }
                handleClickOpen();
              }}
              variant='contained'
            >
              Book
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography
            style={{
              wordBreak: 'break-word',
              margin: '20px 0',
            }}
            component='div'
            variant='h6'
          >
            Booking List
          </Typography>
          {!bookList.length && (
            <Typography variant='body2' color='text.secondary'>
              No Booking List
            </Typography>
          )}
          {bookList.length !== 0 && (
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
                        {row.status === 'accepted' && (
                          <Button
                            onClick={() => {
                              setCurBookItem(row);
                              setOpen2(true);
                              setRatingsScore(0);
                              setComment('');
                            }}
                            size='small'
                            variant='contained'
                          >
                            Review
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography
            style={{
              wordBreak: 'break-word',
              margin: '20px 0 0',
            }}
            component='div'
            variant='h6'
          >
            Reviews
          </Typography>
          {detail?.reviews?.length === 0 && (
            <Typography
              style={{
                marginTop: 20,
              }}
              variant='body2'
              color='text.secondary'
            >
              No Reviews
            </Typography>
          )}
          {detail?.reviews?.length !== 0 && (
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              {detail?.reviews?.map((v) => {
                return (
                  <>
                    <ListItem style={{
                      borderBottom: '1px solid #ddd'
                    }} alignItems='flex-start'>
                      <ListItemText
                        primary={v.email}
                        secondary={
                          <React.Fragment>
                            <div>
                              <Rating
                                size='small'
                                name='read-only'
                                value={v.score}
                                precision={0.1}
                                readOnly
                              />
                            </div>
                            <Typography
                              sx={{ display: 'inline' }}
                              component='span'
                              variant='body2'
                              color='text.primary'
                            >
                              {v.comment}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {/* <Divider variant='inset' component='li' /> */}
                  </>
                );
              })}
            </List>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Detail;
