// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { useTranslation } from 'react-i18next'

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showConfirmNewPassword: boolean
}

const defaultValues = {
  newPassword: '',
  currentPassword: '',
  confirmNewPassword: ''
}

const schema = yup.object().shape({
  currentPassword: yup.string().min(8).required(),
  newPassword: yup
    .string()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number'
    )
    .required(),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ChangePasswordCard = () => {
  
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()

  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleMouseDownCurrentPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onPasswordFormSubmit = (data: any) => {
    if (auth && auth.user) {
      axios.post(authConfig.backEndApiChatBook + '/api/user/setpassword', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} })
         .then(res=>res.data)
         .then(res=>{
          if(res.status == 'ok') {
            toast.success(t(res.msg) as string, { duration: 4000, position: 'top-center' })
          }
          else {
            toast.error(t(res.msg) as string, { duration: 4000, position: 'top-center' })
          }
         })
    }
    reset(defaultValues)
  }

  return (
    <Card>
      <CardHeader title={`${t('Change Password')}`} />
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-current-password' error={Boolean(errors.currentPassword)}>
                  {`${t('Current Password')}`}
                </InputLabel>
                <Controller
                  name='currentPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      size='small'
                      label={`${t('Current Password')}`}
                      onChange={onChange}
                      id='input-current-password'
                      error={Boolean(errors.currentPassword)}
                      type={values.showCurrentPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
                          >
                            <Icon icon={values.showCurrentPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.currentPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.currentPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-new-password' error={Boolean(errors.newPassword)}>
                  {`${t('New Password')}`}
                </InputLabel>
                <Controller
                  name='newPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      size='small'
                      label={`${t('New Password')}`}
                      onChange={onChange}
                      id='input-new-password'
                      error={Boolean(errors.newPassword)}
                      type={values.showNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownNewPassword}
                          >
                            <Icon icon={values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.newPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-confirm-new-password' error={Boolean(errors.confirmNewPassword)}>
                {`${t('Confirm New Password')}`}
                </InputLabel>
                <Controller
                  name='confirmNewPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      size='small'
                      label={`${t('Confirm New Password')}`}
                      onChange={onChange}
                      id='input-confirm-new-password'
                      error={Boolean(errors.confirmNewPassword)}
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={handleMouseDownConfirmNewPassword}
                          >
                            <Icon icon={values.showConfirmNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmNewPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmNewPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mt: 1, color: 'text.secondary' }}>{`${t('Password Requirements')}`}:</Typography>
              <Box
                component='ul'
                sx={{ pl: 4, mb: 0, '& li': { mb: 4, color: 'text.secondary', '&::marker': { fontSize: '1.25rem' } } }}
              >
                <li>{`${t('Minimum 8 characters long - the more, the better')}`}</li>
                <li>{`${t('At least one lowercase & one uppercase character')}`}</li>
                <li>{`${t('At least one number, symbol, or whitespace character')}`}</li>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' type='submit' sx={{ mr: 3 }}>
              {`${t('Save Changes')}`}
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={() => reset()}>
              {`${t('Reset')}`}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard