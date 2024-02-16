import React from 'react'
import Box from '@mui/material/Box'

export default function ImageSwitcher() {
  const handleMouseMove = event => {
    const container = event.currentTarget
    const x = event.clientX - container.getBoundingClientRect().left // 获取鼠标相对于容器的X坐标
    const width = container.offsetWidth
    const clipSize = 100 - (x / width) * 100 // 修改这里计算clipSize
    container.style.setProperty('--clip-size', `${clipSize}%`)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: 500, // 容器宽度
        height: 333, // 容器高度
        overflow: 'hidden',
        '&:hover > img:last-child': {
          clipPath: 'inset(0 var(--clip-size, 100%) 0 0)'
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={e => e.currentTarget.style.setProperty('--clip-size', '100%')}
    >
      <img
        src='/images/cards/paper-boat.png'
        alt='First'
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
      <img
        src='/images/cards/workstation.png'
        alt='Second'
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
    </Box>
  )
}
