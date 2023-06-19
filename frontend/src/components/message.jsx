import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
function Message () {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const Toast = (message) => {
    setOpen(true);
    setMsg(message);
  };
  useEffect(() => {
    window.Toast = Toast;
  }, [])
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={2000}
      onClose={() => {
        setOpen(false);
      }}
      message={msg}
    />
  );
}

export default Message;
