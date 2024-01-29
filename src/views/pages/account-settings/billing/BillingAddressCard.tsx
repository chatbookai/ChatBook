// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

const defaultValues = {
  companyName: '',
  billingEmail: ''
}

const BillingAddressCard = () => {
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = () => {
    return
  }

  return (
    <Card>
      <CardHeader title='Billing Address' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='companyName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Company Name'
                      onChange={onChange}
                      placeholder='ThemeSelection'
                      error={Boolean(errors.companyName)}
                    />
                  )}
                />
                {errors.companyName && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  control={control}
                  name='billingEmail'
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='email'
                      value={value}
                      onChange={onChange}
                      label='Billing Email'
                      placeholder='john.doe@example.com'
                      error={Boolean(errors.billingEmail)}
                    />
                  )}
                />
                {errors.billingEmail && (
                  <FormHelperText sx={{ color: 'error.main' }}>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='TAX ID' placeholder='Enter TAX ID' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='VAT Number' placeholder='Enter VAT Number' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Phone Number'
                placeholder='202 555 0111'
                InputProps={{ startAdornment: <InputAdornment position='start'>US (+1)</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select label='Country' defaultValue='australia'>
                  <MenuItem value='australia'>Australia</MenuItem>
                  <MenuItem value='canada'>Canada</MenuItem>
                  <MenuItem value='france'>France</MenuItem>
                  <MenuItem value='united-kingdom'>United Kingdom</MenuItem>
                  <MenuItem value='united-states'>United States</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label='Billing Address' placeholder='Billing Address' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='State' placeholder='California' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='number' label='Zip Code' placeholder='231465' />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                Save Changes
              </Button>
              <Button variant='outlined' color='secondary'>
                Discard
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default BillingAddressCard
