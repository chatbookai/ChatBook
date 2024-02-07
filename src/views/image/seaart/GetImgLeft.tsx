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
import Box from '@mui/material/Box'
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
import toast from 'react-hot-toast'

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
    sendButtonText,
    generateSimilarData
  } = props

  // ** States
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  
  //const expandIcon = (value: string) => <Icon icon={expanded === value ? 'mdi:minus' : 'mdi:plus'} />

  const [modelValue, setModelValue] = useState<string>('stable-diffusion-v1-6')
  const ModelList: any[] = []
  ModelList.push({name: "Stable Diffusion XL 1.0", value: "stable-diffusion-xl-1024-v1-0"})
  ModelList.push({name: "Stable Diffusion 1.6", value: "stable-diffusion-v1-6"})
  const handleModelChange = (event: any) => {
    setModelValue(event.target.value);
  }

  const [promptValue, setPromptValue] = useState<string>("A captivating portrait of a Chinese girl radiating grace and elegance. The painting captures her intriguing beauty in intricate detail, showcasing a serene aura that captivates the viewer's gaze. The girl's delicate features are adorned with traditional Chinese attire, further emphasizing her cultural heritage")
  const [negativePromptValue, setNegativePromptValue] = useState<string>('blurry, bad')

  const [StyleValue, setStyleValue] = useState<string>('enhance')
  const StyleList: any[] = []
  StyleList.push({name: "enhance", value: "enhance"})
  StyleList.push({name: "analog-film", value: "analog-film"})
  StyleList.push({name: "anime", value: "anime"})
  StyleList.push({name: "cinematic", value: "cinematic"})
  StyleList.push({name: "comic-book", value: "comic-book"})
  StyleList.push({name: "digital-art", value: "digital-art"})
  StyleList.push({name: "fantasy-art", value: "fantasy-art"})
  StyleList.push({name: "isometric", value: "isometric"})
  StyleList.push({name: "line-art", value: "line-art"})
  StyleList.push({name: "low-poly", value: "low-poly"})
  StyleList.push({name: "modeling-compound", value: "modeling-compound"})
  StyleList.push({name: "neon-punk", value: "neon-punk"})
  StyleList.push({name: "origami", value: "origami"})
  StyleList.push({name: "photographic", value: "photographic"})
  StyleList.push({name: "pixel-art", value: "pixel-art"})
  StyleList.push({name: "tile-texture", value: "tile-texture"})
  StyleList.push({name: "3d-model ", value: "3d-model "})

  const handleStyleChange = (event: any) => {
    setStyleValue(event.target.value);
  }

  const [stepsValue, setStepsValue] = useState<number>(40)
  const handleStepsChange = (event: any) => {
    setStepsValue(event.target.value);
  };

  const [seedValue, setSeedValue] = useState<string>('')
  const handleSeedChange = (event: any) => {
    setSeedValue(event.target.value);
  };

  const [CFGScaleValue, setCFGScaleValue] = useState<number>(1)
  const handleCFGScaleChange = (event: any) => {
    setCFGScaleValue(event.target.value);
  };

  const [numberOfImagesValue, setNumberOfImagesValue] = useState<number>(1)
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
      handleSubmitText(`${t('Generate') as string} ${numberOfImagesValue} ${t('images') as string}`)
    }
    else {
      handleSubmitText(`${t('Generate') as string} ${numberOfImagesValue} ${t('image') as string}`)
    }
  }, [numberOfImagesValue])

  useEffect(()=>{
    if(generateSimilarData) {
      console.log("generateSimilarData 111111", generateSimilarData)
      setModelValue(generateSimilarData.model)
      setPromptValue(generateSimilarData.prompt)
      setNegativePromptValue(generateSimilarData.negative_prompt)
      setStyleValue(generateSimilarData.style)
      setStepsValue(generateSimilarData.steps)

      //setSeedValue('')
      //setCFGScaleValue(generateSimilarData.steps)
    }
  }, [generateSimilarData])


  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if(promptValue == null || promptValue == '') {      
      toast.error(t('Prompt Must Not Null') as string, { duration: 4000 })

      return
    }
    if(negativePromptValue == null || negativePromptValue == '') {      
      toast.error(t('Negative Prompt Must Not Null') as string, { duration: 4000 })

      return
    }
    const PostData: any = {}
    PostData['model'] = modelValue
    PostData['prompt'] = promptValue
    PostData['negativePrompt'] = negativePromptValue
    PostData['style'] = StyleValue
    PostData['steps'] = stepsValue
    PostData['seed'] = seedValue
    PostData['CFGScale'] = CFGScaleValue
    PostData['width'] = 512
    PostData['height'] = 512
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
              {t('Model & Prompt') as string}
              </Typography>
            </AccordionSummary>
            <Divider sx={{ m: '0 !important' }} />
            <AccordionDetails>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel >{t('Model') as string}</InputLabel>
                    <Select
                      label={t('Model') as string}
                      defaultValue={modelValue}
                      value={modelValue}
                      size="small"
                      onChange={handleModelChange}
                    >
                      {ModelList.map((Item: any, Index: number)=>{
                        return (<MenuItem key={Index} value={Item.value}>{Item.name}</MenuItem>)                          
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField multiline rows={8} fullWidth label={t('Prompt') as string} placeholder='' value={promptValue} onChange={(event: any)=>setPromptValue(event.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField multiline rows={4} fullWidth label={t('Negative Prompt') as string} placeholder='' defaultValue={negativePromptValue} onChange={(event: any)=>setNegativePromptValue(event.target.value)}/>
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
              {t('Advanced') as string}
              </Typography>
            </AccordionSummary>
            <Divider sx={{ m: '0 !important' }} />
            <AccordionDetails sx={{ pt: 6, pb: 6 }}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <InputLabel >{t('Number of images') as string}:</InputLabel>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      defaultValue={numberOfImagesValue}
                      name='NumberOfImages'
                      onChange={handleNumberOfImagesChange}
                      >
                      {NumberOfImagesList.map((Item: any, Index: number)=>{
                        return (<FormControlLabel key={Index} value={Item.value} control={<Radio />} label={Item.name} />)                          
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ flexWrap: 'wrap', width: '98%' }}>
                    <FormLabel>{t('Steps') as string}: {stepsValue}</FormLabel>
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
                  <FormControl sx={{ flexWrap: 'wrap', width: '98%' }}>
                    <FormLabel>{t('CFG Scale') as string}: {CFGScaleValue}</FormLabel>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      defaultValue={CFGScaleValue}
                      value={CFGScaleValue}
                      onChange={handleCFGScaleChange}
                      aria-labelledby='continuous-slider'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="number" fullWidth label={t('Seed') as string} name='Seed' placeholder='' size="small" defaultValue={seedValue} onChange={handleSeedChange}/>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <InputLabel >{t('Style') as string}</InputLabel>
                    <Select
                      label={t('Style') as string}
                      defaultValue={StyleValue}
                      value={StyleValue}
                      size="small"
                      onChange={handleStyleChange}
                    >
                      {StyleList.map((Item: any, Index: number)=>{
                        return (<MenuItem key={Index} value={Item.value}>{Item.name}</MenuItem>)                          
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
