// ** React Imports
import { useEffect } from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Third Party Components
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '100%' }
}))

const schema = yup.object().shape({
})

const UserAccount = () => {
  // ** Hook
  const { t } = useTranslation()

  // ** Hook
  const auth = useAuth()

  // defaultValues 必须保存每个字段有一个确实的值
  const defaultValues = {
    "id": 0,
    "email": "",
    "username": "",
    "firstname": "",
    "lastname": "",
    "organization": "",
    "role": "",
    "mobile": "",
    "address": "",
    "state": "",
    "zipcode": "",
    "country": "",
    "language": "",
    "timezone": "",
    "nickname": "",
    "birthday": "",
    "avatar": "",
    "mobile_status": 0,
    "google_auth": "",
    "github_auth": "",
    "user_type": "",
    "user_status": 0,
    "password": "",
    "createtime": 0
  }

  const fetchData = async function () {
    if (auth.user) {
      const RS = await axios.get('/api/user/getuserinfo', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      if(RS && RS.data) {
        Object.entries(RS.data).forEach(([key, value]) => {

          // @ts-ignore
          setValue(key, value);
        });
      }
    }    
  }

  useEffect(() => {
    fetchData()  
  }, [])

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    if(!data.firstname) {
      setError('firstname', {
        type: 'manual',
        message: `${t('This field must have a value')}`
      })
    }
    if(!data.lastname) {
      setError('lastname', {
        type: 'manual',
        message: `${t('This field must have a value')}`
      })
    }
    if (auth.user) {
      axios.post('/api/user/setuserinfo', data, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} })
         .then(res=>res.data)
         .then(res=>{
          toast.success(res.msg, { duration: 4000 })
         })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ pb: theme => `${theme.spacing(10)}` }}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='firstname'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('First name')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.firstname)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.firstname && <FormHelperText sx={{ color: 'error.main' }}>{errors.firstname.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='lastname'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Last name')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.lastname)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.lastname && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastname.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='organization'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Organization')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.organization)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.organization && <FormHelperText sx={{ color: 'error.main' }}>{errors.organization.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='mobile'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Mobile')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.mobile)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.mobile && <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='address'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Address')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.address)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='state'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('State')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.state)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.state && <FormHelperText sx={{ color: 'error.main' }}>{errors.state.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='country'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Country')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.country)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Controller
                      name='language'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label={`${t('Language')}`}
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.language)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.language && <FormHelperText sx={{ color: 'error.main' }}>{errors.language.message}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Button size='large' type='submit' variant='contained' sx={{ mb: 3, mt: 5 }}>
                {`${t(`Save`)}`}
                </Button>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

//UserAccount.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default UserAccount
