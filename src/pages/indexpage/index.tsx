import React from 'react';
import Grid from '@mui/material/Grid';
import CardIntro from './CardIntro';
import ImageIntro from './ImageIntro';
import WhyWithUsCard from './WhyWithUsCard';

const IndexPage: React.FC = () => {
  return (
    <Grid container spacing={8}> 
      <Grid item xs={12}>
        <CardIntro />
      </Grid>
      <Grid item xs={12}>
        <WhyWithUsCard />
      </Grid>
      <Grid item xs={12}>
        <ImageIntro />
      </Grid>
    </Grid>
  );
};

export default IndexPage;
