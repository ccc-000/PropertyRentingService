import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Delete, AddCircle } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';
import sty from './hostedListings.module.css';

function HostedListings () {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [curItem, setCurItem] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);
  const [listData, setListData] = useState([]);
  const userinfo = useSelector((state) => {
    return state.userinfo;
  });
  const handleClickOpen = (item) => {
    if (item.published) {
      request.put(`/listings/unpublish/${item.id}`).then(() => {
        getData();
      });
      return;
    }
    setDateRanges([]);
    setCurItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getData = () => {
    request.get('/listings').then(async (res) => {
      let listings = res.listings;
      listings = listings.filter((v) => {
        return v.owner === userinfo.email;
      });
      const endData = [];
      for (let i = 0; i < listings.length; i++) {
        const r = await request.get(`/listings/${listings[i].id}`);
        r.listing.matched = true;
        endData.push({ ...listings[i], ...r.listing });
      }
      setListData(endData);
      console.log('endData = ', endData);
    });
  };
  useEffect(
    () => {
      // console.log('userinfo = ', userinfo);
      if (userinfo) {
        getData();
      }
    },
    [userinfo]
  );

  return (
    <div className={sty.box}>
      <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogTitle>Publishing</DialogTitle>
        <DialogContent>
          <Grid rowSpacing={2} container>
            <Grid item xs={12} md={12}>
              <span>Add Daterange:</span>
              <IconButton
                onClick={() => {
                  const deep = [...dateRanges];
                  deep.push({
                    start: null,
                    end: null,
                  });
                  setDateRanges(deep);
                }}
                color='primary'
                component='label'
              >
                <AddCircle />
              </IconButton>
            </Grid>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              localeText={{ start: 'Start', end: 'End' }}
            >
              {dateRanges.map((v, i) => {
                return (
                  <Grid key={i} item xs={12} md={12}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <DateRangePicker
                        value={[v.start, v.end]}
                        onChange={(newValue) => {
                          const [start, end] = newValue;
                          const deep = [...dateRanges];
                          deep[i] = {
                            start,
                            end,
                          };
                          setDateRanges(deep);
                        }}
                        renderInput={(startProps, endProps) => (
                          <React.Fragment>
                            <TextField size='small' {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField size='small' {...endProps} />
                          </React.Fragment>
                        )}
                      />
                      <Delete
                        onClick={() => {
                          const deep = [...dateRanges];
                          deep.splice(i, 1);
                          setDateRanges(deep);
                        }}
                        style={{
                          color: 'red',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </Grid>
                );
              })}
            </LocalizationProvider>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              // console.log('dates = ', dateRanges);
              if (!dateRanges.length) {
                window.Toast('dateRanges cannot be empty');
                return;
              } else {
                const filterArr = dateRanges.filter((v) => {
                  return !v.start || !v.end;
                });
                if (filterArr.length) {
                  window.Toast('Each dateRanges cannot be empty');
                  return;
                }
              }
              // dayjs(userinfo.birthDate).format('DD/MM/YYYY'))
              const availability = [];
              dateRanges.forEach((v) => {
                availability.push({
                  start: dayjs(v.start).format('MM/DD/YYYY'),
                  end: dayjs(v.end).format('MM/DD/YYYY'),
                });
              });
              // console.log('availability = ', availability);
              request
                .put(`/listings/publish/${curItem.id}`, {
                  availability,
                })
                .then((res) => {
                  getData();
                  handleClose();
                });
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <Button
          onClick={() => {
            navigate('/home/createHostedListings');
          }}
          variant='contained'
        >
          Create
        </Button>
      </div>

      <Grid
        style={{
          width: '90%',
          margin: '20px auto 50px',
        }}
        container
        spacing={2}
      >
        {listData.map((item, index) => {
          if (!item.matched) {
            return null;
          }
          let score = 0;
          item.reviews.forEach((v) => {
            score += v.score;
          });
          score = score / item.reviews.length;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                onClick={() => {
                  // navigate(`/home/editHostedListings/${item.id}`);
                }}
                sx={{
                  maxWidth: 345,
                }}
              >
                <CardMedia
                  component='img'
                  height='140'
                  image={item.thumbnail}
                  alt='green iguana'
                />
                <CardContent
                  style={{
                    height: 140,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: '#1890ff',
                    }}
                  >
                    {item.metadata.type} · {item.metadata.bathroomsNumber}{' '}
                    bathrooms · {item.metadata.bedrooms.length} bedrooms
                  </div>
                  <Typography
                    style={{
                      wordBreak: 'break-word',
                      margin: '3px 0',
                    }}
                    component='div'
                    variant='h6'
                  >
                    {item.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    ${item.price}/per night
                  </Typography>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 5,
                    }}
                  >
                    <Rating
                      size='small'
                      name='read-only'
                      precision={0.1}
                      value={score}
                      readOnly
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: '#666',
                        marginLeft: 5,
                      }}
                    >
                      {item.reviews.length}
                    </span>
                  </div>
                </CardContent>
                <CardActions>
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                  <div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/home/editHostedListings/${item.id}`);
                      }}
                      size='small'
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickOpen(item);
                      }}
                      size='small'
                    >
                      {item.published ? 'Unpublish' : 'Go live'}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        request.delete(`/listings/${item.id}`).then((res) => {
                          getData();
                        });
                      }}
                      size='small'
                      color='error'
                    >
                      Delete
                    </Button>
                  </div>
                  <div>
                    <Button
                      color='secondary'
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/home/bookingRequest/${item.id}`);
                      }}
                      size='small'
                    >
                      Handle Booking Request
                    </Button>
                  </div>
                  </div>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default HostedListings;
