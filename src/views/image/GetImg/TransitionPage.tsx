import React, { useState, useEffect } from 'react';
import { CardMedia, CircularProgress, Typography } from '@mui/material';

const TransitionPage = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // 清除计时器
    return () => clearInterval(interval);
  }, []);

  return (
    <CardMedia
      component="div"
      style={{
        backgroundColor: '#1f2023',
        height: '11.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
      }}
    >
      <CircularProgress
        size={35}
        thickness={4}
        style={{ color: '#fff' }}
        value={timer * 10} // 根据你的需求设置进度条的值
      />
      <Typography variant="h6" style={{ color: '#fff', marginTop: 16 }}>
        {timer} S
      </Typography>
    </CardMedia>
  );
};

export default TransitionPage;
