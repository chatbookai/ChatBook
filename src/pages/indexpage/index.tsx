import React from 'react'
import CardIntro from './CardIntro'
import ImageIntro from './ImageIntro'
import WhyWithUsCard from './WhyWithUsCard'

const indexPage: React.FC = () => {
  return (
    <div>
      <CardIntro />
      <WhyWithUsCard />
      <ImageIntro />
    </div>
  )
}

export default indexPage
