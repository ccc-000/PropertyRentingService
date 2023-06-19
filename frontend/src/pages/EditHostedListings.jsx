import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete, AddCircle } from '@mui/icons-material';
import request from '../utils/request';
import { useNavigate, useParams } from 'react-router-dom';
import sty from './editHostedListings.module.css';
export default function Edit () {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [bathroomsNumber, setBathroomsNumber] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [bedrooms, setBedrooms] = useState([]);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (title === '') {
      window.Toast('title cannot be empty');
      return;
    }
    if (address === '') {
      window.Toast('address cannot be empty');
      return;
    }
    if (!price) {
      window.Toast('price cannot be empty');
      return;
    }
    if (!type) {
      window.Toast('type cannot be empty');
      return;
    }
    if (!bathroomsNumber) {
      window.Toast('bathroomsNumber cannot be empty');
      return;
    }
    if (!amenities.length) {
      window.Toast('amenities cannot be empty');
      return;
    } else {
      const filterArr = amenities.filter((v) => {
        return !v;
      });
      if (filterArr.length) {
        window.Toast('Each amenities cannot be empty');
        return;
      }
    }
    if (!bedrooms.length) {
      window.Toast('bedrooms cannot be empty');
      return;
    } else {
      const filterArr = bedrooms.filter((v) => {
        return !v.type || !v.bedsNumber;
      });
      if (filterArr.length) {
        window.Toast('Each bedrooms cannot be empty');
        return;
      }
    }
    if (!thumbnail) {
      window.Toast('thumbnail cannot be empty');
      return;
    }
    if (!images.length) {
      window.Toast('images cannot be empty');
      return;
    }
    request
      .put(`/listings/${id}`, {
        title,
        address,
        price,
        thumbnail,
        metadata: {
          bathroomsNumber,
          images,
          amenities,
          bedrooms,
          type,
        },
      })
      .then((res) => {
        navigate('/home/hostedListings');
      });
  };

  useEffect(() => {
    request
      .get(`/listings/${id}`)
      .then((res) => {
        console.log('res = ', res.listing)
        const listing = res.listing;
        setTitle(listing.title);
        setAddress(listing.address);
        setPrice(listing.price);
        setType(listing.metadata.type);
        setBathroomsNumber(listing.metadata.bathroomsNumber);
        setThumbnail(listing.thumbnail);
        setAmenities(listing.metadata.amenities);
        setBedrooms(listing.metadata.bedrooms);
        setImages(listing.metadata.images);
      });
  }, []);

  return (
    <Box className={sty.box}>
      <Box className={sty.formBox}>
        <Typography
          variant='h6'
          gutterBottom
          style={{
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Hosted Listing Create
        </Typography>

        <Grid rowSpacing={2} container>
          <Grid item xs={12} md={12}>
            <TextField
              value={title}
              size='small'
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              style={{
                width: '100%',
              }}
              label='Title'
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              value={address}
              size='small'
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              style={{
                width: '100%',
              }}
              label='Address'
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              value={price}
              size='small'
              type='number'
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              style={{
                width: '100%',
              }}
              label='Price'
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <span>Thumbnail:</span>
            <IconButton
              color='primary'
              aria-label='upload picture'
              component='label'
            >
              <input
                onChange={(e) => {
                  const files = e.target.files;
                  const reader = new FileReader();
                  reader.readAsDataURL(files[0]);
                  reader.onload = () => {
                    setThumbnail(reader.result);
                  };
                }}
                hidden
                accept='image/*'
                type='file'
              />
              <PhotoCamera />
            </IconButton>
          </Grid>
          {thumbnail && (
            <Grid item xs={12} md={12}>
              <Grid rowSpacing={2} container>
                <Grid item xs={4} md={3}>
                  <div className={sty.uploadImgCard}>
                    <img src={thumbnail} />
                    <Delete
                      onClick={() => {
                        setThumbnail('');
                      }}
                      className={sty.uploadImgDel}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            <TextField
              value={type}
              size='small'
              onChange={(e) => {
                setType(e.target.value);
              }}
              style={{
                width: '100%',
              }}
              label='Type'
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              value={bathroomsNumber}
              size='small'
              type='number'
              onChange={(e) => {
                setBathroomsNumber(e.target.value);
              }}
              style={{
                width: '100%',
              }}
              label='Bathrooms Number'
              required
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <span>Add Amenities:</span>
            <IconButton
              onClick={() => {
                const deep = [...amenities];
                deep.push('');
                setAmenities(deep);
              }}
              color='primary'
              component='label'
            >
              <AddCircle />
            </IconButton>
          </Grid>
          {amenities.map((v, i) => {
            return (
              <Grid key={i} item xs={12} md={12}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    value={v}
                    size='small'
                    onChange={(e) => {
                      const val = e.target.value;
                      const deep = [...amenities];
                      deep[i] = val;
                      setAmenities(deep);
                    }}
                    style={{
                      flex: 1,
                    }}
                    label='Amenities'
                    required
                  />
                  <Delete
                    onClick={() => {
                      const deep = [...amenities];
                      deep.splice(i, 1);
                      setAmenities(deep);
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
          <Grid item xs={12} md={12}>
            <span>Add Bedrooms:</span>
            <IconButton
              onClick={() => {
                const deep = [...bedrooms];
                deep.push({
                  type: '',
                  bedsNumber: 0,
                });
                setBedrooms(deep);
              }}
              color='primary'
              component='label'
            >
              <AddCircle />
            </IconButton>
          </Grid>
          {bedrooms.map((v, i) => {
            return (
              <Grid key={i} item xs={12} md={12}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    value={v.type}
                    size='small'
                    onChange={(e) => {
                      const val = e.target.value;
                      const deep = [...bedrooms];
                      deep[i].type = val;
                      setBedrooms(deep);
                    }}
                    style={{
                      flex: 1,
                      marginRight: 20,
                    }}
                    label='Type'
                    required
                  />
                  <TextField
                    value={v.bedsNumber}
                    size='small'
                    type='number'
                    onChange={(e) => {
                      const val = e.target.value;
                      const deep = [...bedrooms];
                      deep[i].bedsNumber = val;
                      setBedrooms(deep);
                    }}
                    style={{
                      flex: 1,
                    }}
                    label='BedsNumber'
                    required
                  />
                  <Delete
                    onClick={() => {
                      const deep = [...bedrooms];
                      deep.splice(i, 1);
                      setBedrooms(deep);
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

          <Grid item xs={12} md={12}>
            <span>Images:</span>
            <IconButton
              color='primary'
              aria-label='upload picture'
              component='label'
            >
              <input
                onChange={(e) => {
                  const files = e.target.files;
                  const reader = new FileReader();
                  reader.readAsDataURL(files[0]);
                  reader.onload = () => {
                    const deepImages = [...images];
                    deepImages.push(reader.result);
                    setImages(deepImages);
                  };
                }}
                hidden
                accept='image/*'
                type='file'
              />
              <PhotoCamera />
            </IconButton>
          </Grid>
          {!!images.length && (
            <Grid item xs={12} md={12}>
              <Grid rowSpacing={4} container>
                {images.map((v, i) => {
                  return (
                    <Grid key={i} item xs={4} md={3}>
                      <div className={sty.uploadImgCard}>
                        <img src={v} />
                        <Delete
                          onClick={() => {
                            const deepImages = [...images];
                            deepImages.splice(i, 1);
                            setImages(deepImages);
                          }}
                          className={sty.uploadImgDel}
                        />
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}

          <Grid
            item
            md={12}
            xs={12}
            style={{
              textAlign: 'center',
            }}
          >
            <Button onClick={handleSubmit} variant='contained'>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
