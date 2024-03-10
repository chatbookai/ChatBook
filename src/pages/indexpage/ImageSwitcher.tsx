import React from 'react'
import Box from '@mui/material/Box'

// 定义一个对象，用于映射标签值到对应的图片路径
const imagePairs = {
  '1': { after: '/images/cards/RenovateRoomafter.jpg', before: '/images/cards/RenovateRoombefore.jpg' },
  '2': { after: '/images/cards/CleanRoomafter.jpg', before: '/images/cards/CleanRoombefore.jpg' }
}

export default function ImageSwitcher({ value }) {
  const handleMouseMove = event => {
    const container = event.currentTarget
    const x = event.clientX - container.getBoundingClientRect().left
    const width = container.offsetWidth
    const clipSize = (x / width) * 100
    container.style.setProperty('--clip-size', `${clipSize}%`)
  }

  // 根据传入的 value 选择对应的图片
  const { after, before } = imagePairs[value] || imagePairs['1'] // 默认为 '1'

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', sm: '90%', md: '80%', lg: '35vw' }, // 响应式宽度
        height: { xs: '30vw', sm: '15vw', md: '40vw', lg:'20vw' }, // 响应式高度，或者使用固定高度
        overflow: 'hidden',
        '&:hover > img:last-child': {
          clipPath: `inset(0 0 0 var(--clip-size, 0%))`
        },
        pt: ['0 !important', '0.5rem !important'], pb: ['0.5rem !important', '0.5 !important'],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={e => e.currentTarget.style.setProperty('--clip-size', '0%')}
    >
      <img src={after} alt='After' style={{ position: 'absolute', width: '100%', height: '100%' }} />
      <img src={before} alt='Before' style={{ position: 'absolute', width: '100%', height: '100%' }} />
    </Box>
  )
}
