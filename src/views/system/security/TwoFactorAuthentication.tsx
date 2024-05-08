// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

const TwoFactorAuthenticationCard = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)

  // ** Hooks
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { phoneNumber: '' } })

  const toggle2FADialog = () => setOpen(!open)

  const on2FAFormSubmit = () => {
    toggle2FADialog()
    setValue('phoneNumber', '')
  }

  const close2FADialog = () => {
    toggle2FADialog()
    clearErrors('phoneNumber')
    setValue('phoneNumber', '')
  }

  return (
    <>
      <Card>
        <CardHeader title='Two-steps verification' />
        <CardContent>
          <Typography sx={{ mb: 4, color: 'text.secondary' }}>Two factor authentication is not enabled yet.</Typography>
          <Typography sx={{ mb: 6, color: 'text.secondary' }}>
            Two-factor authentication adds an additional layer of security to your account by requiring more than just a
            password to log in.{' '}
            <Box
              href='/'
              component={'a'}
              onClick={(e: SyntheticEvent) => e.preventDefault()}
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              Learn more.
            </Box>
          </Typography>
          <Button variant='contained' onClick={toggle2FADialog}>
            Enable two-factor authentication
          </Button>
        </CardContent>
      </Card>

      <Dialog fullWidth open={open} onClose={toggle2FADialog}>
        <DialogContent sx={{ py: 18, px: 18 }}>
          <Box sx={{ mb: 12, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h5' sx={{ fontSize: '1.625rem' }}>
              Enable One Time Password
            </Typography>
          </Box>

          <IconButton size='small' onClick={close2FADialog} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>

          <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Verify Your Mobile Number for SMS</Typography>
          <Typography sx={{ mt: 4, mb: 6 }}>
            Enter your mobile phone number with country code and we will send you a verification code.
          </Typography>

          <form onSubmit={handleSubmit(on2FAFormSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel htmlFor='opt-phone-number' error={Boolean(errors.phoneNumber)}>
                Phone Number
              </InputLabel>
              <Controller
                name='phoneNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <OutlinedInput
                    type='number'
                    value={value}
                    onChange={onChange}
                    label='Phone Number'
                    id='opt-phone-number'
                    placeholder='202 555 0111'
                    error={Boolean(errors.phoneNumber)}
                    startAdornment={<InputAdornment position='start'>+1</InputAdornment>}
                  />
                )}
              />
              {errors.phoneNumber && (
                <FormHelperText sx={{ color: 'error.main' }}>Please enter a valid phone number</FormHelperText>
              )}
            </FormControl>
            <div>
              <Button variant='contained' type='submit' sx={{ mr: 3.5 }}>
                Submit
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={close2FADialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TwoFactorAuthenticationCard
