// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Drawer from '@mui/material/Drawer'
import MenuItem from '@mui/material/MenuItem'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails'

// Styled component for Accordion component
const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
  boxShadow: 'none !important',
  border:
    theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,
  '&:not(:last-of-type)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: 'auto'
  },
  '&:first-of-type': {
    '& .MuiButtonBase-root': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderTopRightRadius: theme.shape.borderRadius
    }
  },
  '&:last-of-type': {
    '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius
    }
  }
}))

// Styled component for AccordionSummary component
const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
  marginBottom: -1,
  padding: theme.spacing(0, 4),
  minHeight: theme.spacing(12),
  transition: 'min-height 0.15s ease-in-out',
  borderBottom:
    theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,
  '&.Mui-expanded': {
    minHeight: theme.spacing(12)
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: '10px 0'
  }
}))

// Styled component for AccordionDetails component
const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
  padding: `${theme.spacing(4)} !important`
}))


const GetImgLeft = (props: any) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const {
    handleGenerateImage,
    handleSubmitText,
    sendButtonDisable,
    sendButtonText
  } = props

  // ** States
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  
  const expandIcon = (value: string) => <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} />

  const [modelValue, setModelValue] = useState<string>('realistic-vision-v5-1')
  const ModelList: any[] = []
  ModelList.push({name: "stable-diffusion-v1-5", value: "stable-diffusion-v1-5"})
  ModelList.push({name: "stable-diffusion-v2-1", value: "stable-diffusion-v2-1"})
  ModelList.push({name: "realistic-vision-v1-3", value: "realistic-vision-v1-3"})
  ModelList.push({name: "realistic-vision-v5-1", value: "realistic-vision-v5-1"})
  const handleModelChange = (event: any) => {
    setModelValue(event.target.value);
  }

  const [promptValue, setPromptValue] = useState<string>('busy tavern scene, Ultra realistic, intricate, mysterious, cinematic, Victorian, by Tony Sart and Anato Finnstark, 4k, 8k, illustration, concept art, photorealistic, award winning on Artstation, deviantart')
  const [negativePromptValue, setNegativePromptValue] = useState<string>('Disfigured, cartoon, blurry, nude')

  const [samplerValue, setSamplerValue] = useState<string>('dpmsolver++')
  const SamplerList: any[] = []
  SamplerList.push({name: "Euler Ancestral", value: "euler_a"})
  SamplerList.push({name: "Euler", value: "euler"})
  SamplerList.push({name: "LMS", value: "lms"})
  SamplerList.push({name: "LMS Karras", value: "lms_karras"})
  SamplerList.push({name: "DPM-Solver++", value: "dpmsolver++"})
  SamplerList.push({name: "DPM-Solver++ Karras", value: "dpmsolver++karras"})
  SamplerList.push({name: "DPM++ 2M SDE", value: "dpmsolver++2m_sde"})
  SamplerList.push({name: "DPM++ 2M SDE Karras", value: "dpmsolver++2m_sde_karras"})
  SamplerList.push({name: "DPM-Solver SDE", value: "dpmsolver_sde"})
  SamplerList.push({name: "PLMS", value: "pndm"})
  SamplerList.push({name: "DDIM", value: "ddim"})
  SamplerList.push({name: "KDPM", value: "kdpm2"})
  SamplerList.push({name: "KDPM Ancestral", value: "kdpm2_a"})
  SamplerList.push({name: "Heun", value: "heun"})
  SamplerList.push({name: "UniPC", value: "unipc"})
  SamplerList.push({name: "DEIS", value: "deis"})
  SamplerList.push({name: "KDPM Karras", value: "kdpm2_karras"})
  SamplerList.push({name: "KDPM Karras Ancestral", value: "kdpm2_a_karras"})
  const handleSamplerChange = (event: any) => {
    setSamplerValue(event.target.value);
  }

  const [stepsValue, setStepsValue] = useState<number>(25)
  const handleStepsChange = (event: any) => {
    setStepsValue(event.target.value);
  };

  const [seedValue, setSeedValue] = useState<string>('')
  const handleSeedChange = (event: any) => {
    setSeedValue(event.target.value);
  };

  const [guidanceScaleValue, setGuidanceScaleValue] = useState<number>(1)
  const handleGuidanceScaleChange = (event: any) => {
    setGuidanceScaleValue(event.target.value);
  };

  const [resolutionValue, setResolutionValue] = useState<string>('512px × 512px')
  const ResolutionList: any[] = []
  ResolutionList.push({name: "1:1", value: "512px × 512px"})
  ResolutionList.push({name: "4:5", value: "512px × 640px"})
  ResolutionList.push({name: "2:3", value: "512px × 768px"})
  ResolutionList.push({name: "4:7", value: "512px × 896px"})
  ResolutionList.push({name: "5:4", value: "640px × 512px"})
  ResolutionList.push({name: "3:2", value: "768px × 512px"})
  ResolutionList.push({name: "7:4", value: "896px × 512px"})
  const handleResolutionChange = (event: any) => {
    setResolutionValue(event.target.value);
  }

  const [numberOfImagesValue, setNumberOfImagesValue] = useState<number>(2)
  const NumberOfImagesList: any[] = []
  NumberOfImagesList.push({name: "1", value: 1})
  NumberOfImagesList.push({name: "2", value: 2})
  NumberOfImagesList.push({name: "3", value: 3})
  NumberOfImagesList.push({name: "4", value: 4})
  const handleNumberOfImagesChange = (event: any) => {
    setNumberOfImagesValue(event.target.value);
  }

  useEffect(()=>{
    if(numberOfImagesValue > 1) {
      handleSubmitText(`Generate ${numberOfImagesValue} images`)
    }
    else {
      handleSubmitText(`Generate ${numberOfImagesValue} image`)
    }
  }, [numberOfImagesValue])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const resolutionValueArray = resolutionValue.replaceAll('px', '').split(' × ')
    const PostData: any = {}
    PostData['model'] = modelValue
    PostData['prompt'] = promptValue
    PostData['negativePrompt'] = negativePromptValue
    PostData['sampler'] = samplerValue
    PostData['steps'] = stepsValue
    PostData['seed'] = seedValue
    PostData['guidanceScale'] = guidanceScaleValue
    PostData['width'] = Number(resolutionValueArray[0])
    PostData['height'] = Number(resolutionValueArray[1])
    PostData['numberOfImages'] = numberOfImagesValue
    PostData['outpuFormat'] = "png"
    console.log("PostData: ", PostData)
    handleGenerateImage(PostData)
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
        <Box sx={{ height: `calc(100% - 4.125rem)` }}>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<Icon icon='mdi:chevron-down' />}
              id='form-layouts-collapsible-header-1'
              aria-controls='form-layouts-collapsible-content-1'
            >
              <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
              Model & Prompt
              </Typography>
            </AccordionSummary>
            <Divider sx={{ m: '0 !important' }} />
            <AccordionDetails>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel >Model</InputLabel>
                    <Select
                      label='Model'
                      defaultValue={modelValue}
                      size="small"
                      onChange={handleModelChange}
                    >
                      {ModelList.map((Item: any)=>{
                        return (<MenuItem value={Item.value}>{Item.name}</MenuItem>)                          
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField multiline rows={8} fullWidth label='Prompt' placeholder='' defaultValue={promptValue} onClick={(event: any)=>setPromptValue(event.target.value)}/>
                  <Box sx={{ display: 'flex', alignItems: 'right', justifyContent: 'right'}} >
                    <Button size='small' type='button' variant='contained' sx={{ mt: 1 }} >
                      Random
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField multiline rows={2} fullWidth label='Negative prompt' placeholder='' defaultValue={negativePromptValue} onClick={(event: any)=>setNegativePromptValue(event.target.value)}/>
                </Grid>
                
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
              expandIcon={<Icon icon='mdi:chevron-down' />}
              id='form-layouts-collapsible-header-2'
              aria-controls='form-layouts-collapsible-content-2'
            >
              <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                Output Options
              </Typography>
            </AccordionSummary>
            <Divider sx={{ m: '0 !important' }} />
            <AccordionDetails sx={{ pt: 6, pb: 6 }}>
              
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <InputLabel >Resolution:</InputLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      defaultValue={resolutionValue}
                      value={resolutionValue}
                      name='Resolution'
                      onChange={handleResolutionChange}
                      >
                      {ResolutionList.map((Item: any)=>{
                        return (<FormControlLabel value={Item.value} control={<Radio />} label={Item.name} />)                          
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel >Number of images:</InputLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      defaultValue={numberOfImagesValue}
                      name='NumberOfImages'
                      onChange={handleNumberOfImagesChange}
                      >
                      {NumberOfImagesList.map((Item: any)=>{
                        return (<FormControlLabel value={Item.value} control={<Radio />} label={Item.name} />)                          
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
            <AccordionSummary
              expandIcon={<Icon icon='mdi:chevron-down' />}
              id='form-layouts-collapsible-header-3'
              aria-controls='form-layouts-collapsible-content-3'
            >
              <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
                Advanced
              </Typography>
            </AccordionSummary>
            <Divider sx={{ m: '0 !important' }} />
            <AccordionDetails sx={{ pt: 6, pb: 6 }}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <FormControl sx={{ flexWrap: 'wrap', width: '100%' }}>
                    <FormLabel>Steps: {stepsValue}</FormLabel>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      defaultValue={stepsValue}
                      value={stepsValue}
                      onChange={handleStepsChange}
                      aria-labelledby='continuous-slider'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ flexWrap: 'wrap', width: '100%' }}>
                    <FormLabel>Guidance scale: {guidanceScaleValue}</FormLabel>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      defaultValue={guidanceScaleValue}
                      value={guidanceScaleValue}
                      onChange={handleGuidanceScaleChange}
                      aria-labelledby='continuous-slider'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="number" fullWidth label='Seed' name='Seed' placeholder='' size="small" defaultValue={seedValue} onChange={handleSeedChange}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel >Sampler</InputLabel>
                    <Select
                      label='Sampler'
                      defaultValue={samplerValue}
                      size="small"
                      onChange={handleSamplerChange}
                    >
                      {SamplerList.map((Item: any)=>{
                        return (<MenuItem value={Item.value}>{Item.name}</MenuItem>)                          
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
          <AccordionDetails>
            <Button size='medium' type='button' onClick={handleSubmit} variant='contained' sx={{ mr: 4 }} disabled={sendButtonDisable} >
              {sendButtonText}
            </Button>
          </AccordionDetails>
        </Box>
        
      </Drawer>                 
    </div>
  )
}

export default GetImgLeft
