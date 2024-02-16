import React from 'react'
import CardIntro from './CardIntro'
import ImageSwitcher from './ImageSwitcher'
import ImageIntro from './ImageIntro'

const indexPage: React.FC = () => {
  return (
    <div>
      <CardIntro />
      <ImageSwitcher />
      <ImageIntro />
    </div>
  )
}

export default indexPage
