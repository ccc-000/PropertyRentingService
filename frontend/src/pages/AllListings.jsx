import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Slider,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import request from '../utils/request';
import sty from './allListings.module.css';

function AllListings () {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [bedroomsNumber, setBedroomsNumber] = useState([0, 100]);
  const [price, setPrice] = useState([0, 10000]);
  const [ratings, setRatings] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [listData, setListData] = useState([]);
  const userinfo = useSelector((state) => {
    return state.userinfo;
  });

  const getBookList = () => {
    return request.get('/bookings').then((res) => {
      return res.bookings.filter((v) => {
        return v.owner === userinfo.email;
      });
    });
  };

  useEffect(
    () => {
      getData();
    },
    [userinfo]
  );

  const getData = () => {
    request.get('/listings').then(async (res) => {
      const listings = res.listings;
      let endData = [];
      listings.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      for (let i = 0; i < listings.length; i++) {
        const r = await request.get(`/listings/${listings[i].id}`);
        r.listing.matched = true;
        if (r.listing.published) {
          endData.push({ ...listings[i], ...r.listing });
        }
      }
      if (userinfo) {
        const bookList = await getBookList();
        const newArr = [];
        for (let k = 0; k < endData.length; k++) {
          let bbb = false;
          for (let m = 0; m < bookList.length; m++) {
            if (bookList[m].listingId === endData[k].id) {
              bbb = true;
              continue;
            }
          }
          if (bbb) {
            newArr.unshift(endData[k]);
          } else {
            newArr.push(endData[k]);
          }
        }
        endData = newArr;
      }
      setListData(endData);
      console.log('endData = ', endData);
    });
  };

  return (
    <div className={sty.box}>
      <Grid
        style={{
          maxWidth: '620px',
          margin: 'auto',
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
          <TextField
            value={keyword}
            size='small'
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            style={{
              width: '100%',
            }}
            label='Search'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginRight: 10,
              }}
            >
              BedroomsNumber:
            </span>
            <Slider
              size='small'
              value={bedroomsNumber}
              onChange={(e, newValue) => {
                setBedroomsNumber(newValue);
              }}
              aria-label='Small'
              style={{
                flex: 1,
              }}
              valueLabelDisplay='auto'
            />
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                marginRight: 10,
              }}
            >
              Price:
            </span>
            <Slider
              size='small'
              value={price}
              onChange={(e, newValue) => {
                setPrice(newValue);
              }}
              aria-label='Small'
              max={10000}
              style={{
                flex: 1,
              }}
              valueLabelDisplay='auto'
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Sort By Ratings
            </InputLabel>
            <Select
              size='small'
              style={{
                width: '100%',
              }}
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={ratings}
              label='Sort By Ratings'
              onChange={(e) => {
                setRatings(e.target.value);
              }}
            >
              <MenuItem value={1}>from highest to lowest</MenuItem>
              <MenuItem value={2}>from lowest to highest</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{ start: 'Start', end: 'End' }}
          >
            <DateRangePicker
              value={dateRange}
              onChange={(newValue) => {
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
        </Grid>

        <Grid
          item
          md={12}
          xs={12}
          style={{
            textAlign: 'center',
          }}
        >
          <Button
            onClick={() => {
              let deep = [...listData];
              deep.forEach((v) => {
                let bol = true;
                let score = 0;
                v.start = null;
                v.end = null;
                v.reviews.forEach((ele) => {
                  score += ele.score;
                });
                v.score = score / v.reviews.length;
                if (keyword) {
                  bol =
                    (bol && v.title.toLowerCase().indexOf(keyword) !== -1) ||
                    v.address.toLowerCase().indexOf(keyword) !== -1;
                }
                if (price) {
                  bol = bol && (v.price >= price[0] && v.price <= price[1]);
                }
                if (bedroomsNumber) {
                  bol =
                    bol &&
                    (v.metadata.bedrooms.length >= bedroomsNumber[0] &&
                      v.metadata.bedrooms.length <= bedroomsNumber[1]);
                }
                if (dateRange[0] && dateRange[1]) {
                  const availabilityArr = v.availability;
                  let b = false;
                  for (let k = 0; k < availabilityArr.length; k++) {
                    const kItem = availabilityArr[k];
                    if (
                      dayjs(dateRange[0]).diff(dayjs(kItem.start), 'days') >=
                        0 &&
                      dayjs(dateRange[1]).diff(dayjs(kItem.end), 'days') <= 0
                    ) {
                      b = true;
                      v.start = kItem.start;
                      v.end = kItem.end;
                      break;
                    }
                  }
                  bol = bol && b;
                }
                v.matched = bol;
              });
              if (ratings) {
                deep = deep.sort((a, b) => {
                  return Number(ratings) === 1 ? b.score - a.score : a.score - b.score;
                });
              }
              //   console.log('deep = ', deep);
              setListData(deep);
            }}
            variant='contained'
          >
            Search
          </Button>
        </Grid>
      </Grid>

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
                  if (item.start && item.end) {
                    navigate(
                      `/home/detail/${item.id}?start=${item.start}&end=${
                        item.end
                      }`
                    );
                    return;
                  }
                  navigate(`/home/detail/${item.id}`);
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
                    height: 150,
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
                      value={score}
                      precision={0.1}
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default AllListings;
