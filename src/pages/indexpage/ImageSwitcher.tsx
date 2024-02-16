import React from 'react';
import Box from '@mui/material/Box';

export default function ImageSwitcher() {
  const handleMouseMove = event => {
    const container = event.currentTarget;
    const x = event.clientX - container.getBoundingClientRect().left; // 获取鼠标相对于容器的X坐标
    const width = container.offsetWidth;
    const clipSize = (x / width) * 100; // 修改此处，使得clipSize随鼠标移动从左向右增大
    container.style.setProperty('--clip-size', `${clipSize}%`);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 700, // 容器宽度
        height: 333, // 容器高度
        overflow: 'hidden',
        '&:hover > img:last-child': {
          clipPath: `inset(0 0 0 var(--clip-size, 0%))` // 修改此处，使得第二张图片从左到右逐渐揭露
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={e => e.currentTarget.style.setProperty('--clip-size', '0%')} // 当鼠标离开时，设置clipSize为0%
    >
      <img
        src='/images/cards/roomafter.jpg'
        alt='First'
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <img
        src='/images/cards/roombefore.jpg'
        alt='Second'
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
    </Box>
  );
}
