// ** React Imports
import { SyntheticEvent, useState, useEffect, ElementType, ChangeEvent } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

const GetImgLeft = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    handleGenerateVideo,
    handleSubmitText,
    sendButtonDisable,
    setSendButtonDisable,
    sendButtonText
  } = props

  const [imageValue, setImageValue] = useState<File>()

  const [seedValue, setSeedValue] = useState<number>(0)
  const handleSeedChange = (event: any) => {
    setSeedValue(event.target.value);
  };

  const [CFGScaleValue, setCFGScaleValue] = useState<number>(2)
  const handleCFGScaleChange = (event: any) => {
    setCFGScaleValue(event.target.value);
  };

  const [MotionValue, setMotionValue] = useState<number>(127)
  const handleMotionChange = (event: any) => {
    setMotionValue(event.target.value);
  };

  useEffect(()=>{
    handleSubmitText(`${t('Generate Video') as string}`)
  }, [])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const data: any = new FormData();
    data.append("image", imageValue);
    data.append("seed", seedValue);
    data.append("cfg_scale", CFGScaleValue);
    data.append("motion_bucket_id", MotionValue);
    handleGenerateVideo(data)
  }

  const [imgSrc, setImgSrc] = useState<string>('/images/llms/girl.png')
  const [inputValue, setInputValue] = useState<string>('')
  const [widthValue, setWidthValue] = useState<number>(0)
  const [heightValue, setHeightValue] = useState<number>(0)

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 335,
    borderRadius: 4,
    marginRight: theme.spacing(5)
  }))
  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))
  const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(4)
    }
  }))

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length > 0) {
      setImageValue(files[0] as File);
      reader.onload = (event: any) => {
        setImgSrc(reader.result as string)
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const width = img.width
          const height = img.height
          setWidthValue(width)
          setHeightValue(height)
          if(width == 1024 && height == 576) {
            toast.success('The image size meets the requirements', {
              duration: 4000
            })
            setSendButtonDisable(false)
          }
          else if(width == 576 && height == 1024) {
            toast.success(t('The image size meets the requirements'), {
              duration: 4000
            })
            setSendButtonDisable(false)
          }
          else if(width == 768 && height == 768) {
            toast.success(t('The image size meets the requirements'), {
              duration: 4000
            })
            setSendButtonDisable(false)
          }
          else {
            toast.error(t('Only the following specifications are accepted: 1024x576 or 576x1024 or 768x768'), {
              duration: 4000
            })
            setSendButtonDisable(true)

            return
          }
        };
      }

      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/0.png')
  }

  return (
    <div>
      <Drawer
        open={true}
        variant={'permanent'}
        ModalProps={{
          disablePortal: true,
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          zIndex: 7,
          height: '100%',
          display: 'block',
          position: 'static',
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
            width: 360,
            position:'static',
            borderTopLeftRadius: theme => theme.shape.borderRadius,
            borderBottomLeftRadius: theme => theme.shape.borderRadius
          },
          '& > .MuiBackdrop-root': {
            borderRadius: 1,
            position: 'absolute',
            zIndex: theme => theme.zIndex.drawer - 1
          }
        }}
      >
              <Grid container spacing={5} sx={{ pt: 3, px: 3}}>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <ImgStyled src={imgSrc} alt='Profile Pic' />
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        Upload New Image
                        <input
                          hidden
                          type='file'
                          value={inputValue}
                          accept='image/png, image/jpeg'
                          onChange={handleInputImageChange}
                          id='account-settings-upload-image'
                        />
                      </ButtonStyled>
                      <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                        Reset
                      </ResetButtonStyled>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Typography  sx={{ }}>
                        Width: {widthValue}
                      </Typography>
                      <Typography  sx={{ }}>
                          　
                      </Typography>
                      <Typography  sx={{ }}>
                        Height: {heightValue}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Typography variant='caption' sx={{ }}>
                        Requirement: 1024x576 or 576x1024 or 768x768
                      </Typography>
                    </Box>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ flexWrap: 'wrap', width: '98%' }}>
                    <FormLabel>{t('CFG Scale') as string}: {CFGScaleValue}</FormLabel>
                    <Slider
                      min={5}
                      max={18}
                      step={1}
                      defaultValue={CFGScaleValue}
                      value={CFGScaleValue}
                      onChange={handleCFGScaleChange}
                      aria-labelledby='continuous-slider'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ flexWrap: 'wrap', width: '98%' }}>
                    <FormLabel>{t('Motion') as string}: {MotionValue}</FormLabel>
                    <Slider
                      min={1}
                      max={255}
                      step={1}
                      defaultValue={MotionValue}
                      value={MotionValue}
                      onChange={handleMotionChange}
                      aria-labelledby='continuous-slider'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="number" fullWidth label={t('Seed') as string} name='Seed' placeholder='' size="small" defaultValue={seedValue} onChange={handleSeedChange}/>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Button size='medium' type='button' onClick={handleSubmit} variant='contained' sx={{ mr: 4 }} disabled={sendButtonDisable} >
                    {sendButtonText}
                  </Button>
                </Grid>
              </Grid>
        
      </Drawer>                 
    </div>
  )
}

export default GetImgLeft
