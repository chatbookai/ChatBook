// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import { PricingPlanType } from 'src/@core/components/plan-details/types'

// ** Demo Components
import CurrentPlanCard from 'src/views/account/billing/CurrentPlanCard'

const TabBilling = ({ apiPricingPlanData }: { apiPricingPlanData: PricingPlanType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard data={apiPricingPlanData} />
      </Grid>
    </Grid>
  )
}

export default TabBilling
