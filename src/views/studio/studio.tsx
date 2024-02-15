import { useState, useEffect, SyntheticEvent, Fragment } from 'react'
import { saveAs } from 'file-saver';

// ** MUI Imports
import Typography, { TypographyProps } from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Box, { BoxProps } from '@mui/material/Box'

import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'


// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

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

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 160
    }
}))
  
// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(4)
    }
}))

const NewImageWrapper = styled(Box)<BoxProps>(({ theme }) => ({
        padding: '2rem',
        borderRadius: theme.shape.borderRadius,
        border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`
}))


const RoomDesign = (props: any) => {
    // ** Props
    const {  } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [])

    const [expanded, setExpanded] = useState<string | false>('panel1')
    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    const [currentSection, setCurrentSection] = useState<string>("Real-time Design")
    const [defaultImage, setDefaultImage] = useState<string>("/images/misc/upload.png")

    const TopButtonList: any[] = [
        {name: 'Real-time Design', image:'/images/room/Real-time Design.jpg', icon: 'material-symbols:rocket-launch-outline', onclick: ()=>handleSwitchButtonSection('Real-time Design') },
        {name: 'Hi-Fi Redesign', image:'/images/room/Hi-Fi Redesign.jpg', icon: 'icon-park-solid:all-application', onclick: ()=>handleSwitchButtonSection('Hi-Fi Redesign') },
        {name: 'Partial Remodel', image:'/images/room/Partial Remodel.jpg', icon: 'streamline:application-add-solid', onclick: ()=>handleSwitchButtonSection('Partial Remodel') },
        {name: 'Cabinet Design', image:'/images/room/Cabinet Design.jpg', icon: 'bx:cabinet', onclick: ()=>handleSwitchButtonSection('Cabinet Design') },
        {name: 'Wall & Flooring', image:'/images/room/Wall Flooring.jpg', icon: 'mdi:wall', onclick: ()=>handleSwitchButtonSection('Wall & Flooring') },
    ]

    const RoomImageList: any = {
        'Real-time Design': [
            {name: 'Bedroom', url: '/images/room/Bedroom redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Bedroom redesign.png') },
            {name: 'Living Room', url: '/images/room/Living Room redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Living Room redesign.png') }
            ],
        'Hi-Fi Redesign': [
            {name: 'Bedroom', url: '/images/room/Bedroom redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Bedroom redesign.png') },
            {name: 'Living Room', url: '/images/room/Living Room redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Living Room redesign.png') }
            ],
        'Partial Remodel': [
            {name: 'Bedroom', url: '/images/room/Bedroom redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Bedroom redesign.png') },
            {name: 'Living Room', url: '/images/room/Living Room redesign.png', onclick: ()=>handleSwitchDefaultImage('/images/room/Living Room redesign.png') }
            ],
        'Cabinet Design': [
            {name: 'Kitchen redesign', url: '/images/room/Kitchen redesign 0.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Kitchen redesign 0.jpg') },
            {name: 'Kitchen redesign', url: '/images/room/Kitchen redesign 1.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Kitchen redesign 1.jpg') },
            {name: 'Kitchen redesign', url: '/images/room/Kitchen redesign 2.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Kitchen redesign 2.jpg') },
            {name: 'Kitchen redesign', url: '/images/room/Kitchen redesign 3.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Kitchen redesign 3.jpg') }
            ],
        'Wall & Flooring': [
            {name: 'Wall & Flooring', url: '/images/room/Wall Flooring inpainting 0.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Wall Flooring inpainting 0.jpg') },
            {name: 'Wall & Flooring', url: '/images/room/Wall Flooring inpainting 1.jpg', onclick: ()=>handleSwitchDefaultImage('/images/room/Wall Flooring inpainting 1.jpg') }
            ],
    }

    useEffect(() => {
        const chooseSection: any = TopButtonList.filter((Item)=>Item.name==currentSection)
        console.log("chooseSection", chooseSection)
        setDefaultImage(chooseSection[0].image)
        setGenerateFileShow(null)
    }, [currentSection])

    const handleSwitchButtonSection = (buttonSection: string) => {
        setCurrentSection(buttonSection)
    }

    const handleSwitchDefaultImage = (ImageUrl: string) => {
        //setFiles([])
        setDefaultImage(ImageUrl)
        setGenerateFileShow(null)
        setImageValue(ImageUrl)
    }

    const [generateFileShow, setGenerateFileShow] = useState<string | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [imageValue, setImageValue] = useState<File | string | null>()
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        maxFiles: 1,
        maxSize: 51200000,
        accept: {
          'image/png': ['.pdf'],
          'image/jpeg': ['.jpeg', '.jpg'],
        },
        onDrop: (acceptedFiles: File[]) => {
          setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
          setImageValue(acceptedFiles[0] as File)
          setGenerateFileShow(null)
        }
    })

    const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)
    const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false)
    const [sendButtonText, setSendButtonText] = useState<string>('')

    const [modelValue, setModelValue] = useState<string>('stable-diffusion-v1-6')
    const ModelList: any[] = []
    ModelList.push({name: "Stable Diffusion XL 1.0", value: "stable-diffusion-xl-1024-v1-0"})
    ModelList.push({name: "Stable Diffusion 1.6", value: "stable-diffusion-v1-6"})
    const handleModelChange = (event: any) => {
        setModelValue(event.target.value);
    }

    const [promptValue, setPromptValue] = useState<string>("")
    const [negativePromptValue, setNegativePromptValue] = useState<string>('low quality, Disfigured hands, poorly drawn face, out of frame, bad anatomy, signature, low contrast, overexposed, nsfw, weapon, blood, guro, without cloth')

    const [styleValue, setStyleValue] = useState<string>('enhance')
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

    const [seedValue, setSeedValue] = useState<string>('0')
    const handleSeedChange = (event: any) => {
        setSeedValue(event.target.value);
    };

    const [CFGScaleValue, setCFGScaleValue] = useState<number>(7)
    const handleCFGScaleChange = (event: any) => {
        setCFGScaleValue(event.target.value);
    };

    /*
    const [numberOfImagesValue, setNumberOfImagesValue] = useState<number>(1)
    const NumberOfImagesList: any[] = []
    NumberOfImagesList.push({name: "1", value: 1})
    NumberOfImagesList.push({name: "2", value: 2})
    NumberOfImagesList.push({name: "3", value: 3})
    NumberOfImagesList.push({name: "4", value: 4})
    const handleNumberOfImagesChange = (event: any) => {
        setNumberOfImagesValue(event.target.value);
    }
    */

    const [samplerValue, setSamplerValue] = useState<string>('K_DPMPP_2M')
    const SamplerList: any[] = []
    SamplerList.push({name: "DDIM", value: "DDIM"})
    SamplerList.push({name: "DDPM", value: "DDPM"})
    SamplerList.push({name: "K_DPMPP_2M", value: "K_DPMPP_2M"})
    SamplerList.push({name: "K_DPMPP_2S_ANCESTRAL", value: "K_DPMPP_2S_ANCESTRAL"})
    SamplerList.push({name: "K_DPM_2", value: "K_DPM_2"})
    SamplerList.push({name: "K_DPM_2_ANCESTRAL", value: "K_DPM_2_ANCESTRAL"})
    SamplerList.push({name: "K_EULER", value: "K_EULER"})
    SamplerList.push({name: "K_EULER_ANCESTRAL", value: "K_EULER_ANCESTRAL"})
    SamplerList.push({name: "K_HEUN", value: "K_HEUN"})
    SamplerList.push({name: "K_LMS", value: "K_LMS"})
    const handleSamplerChange = (event: any) => {
        setSamplerValue(event.target.value);
    }


    useEffect(()=>{
        if(t) {
            handleSubmitText(`${t('Generate image') as string}`)
        }
    }, [t])

    /*
    const [generateSimilarData, setGenerateSimilarData] = useState<any>(null)
    useEffect(()=>{
        if(generateSimilarData) {
            setModelValue(generateSimilarData.model)
            setPromptValue(generateSimilarData.prompt)
            setNegativePromptValue(generateSimilarData.negative_prompt)
            setStyleValue(generateSimilarData.style)
            setStepsValue(generateSimilarData.steps)
            setSamplerValue(generateSimilarData.sampler)
            setSeedValue(generateSimilarData.seed)
        }
    }, [generateSimilarData])
    */


    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        if(imageValue == null) {      
            toast.error(t('Please upload a image first') as string, { duration: 4000 })
    
            return
        }
        if(promptValue == null || promptValue == '') {      
        toast.error(t('Prompt Must Not Null') as string, { duration: 4000 })

        return
        }
        if(negativePromptValue == null || negativePromptValue == '') {      
        toast.error(t('Negative Prompt Must Not Null') as string, { duration: 4000 })

        return
        }

        const data: any = new FormData();
        data.append("image", imageValue);
        data.append('model', modelValue);
        data.append('prompt', promptValue);
        data.append('negativePrompt', negativePromptValue);
        data.append('style', styleValue);
        data.append('steps', stepsValue);
        data.append('seed', seedValue);
        data.append('sampler', samplerValue);
        data.append('CFGScale', CFGScaleValue);
        data.append('width', 512);
        data.append('height', 512);
        data.append('numberOfImages', 1);
        data.append('outpuFormat', "png");
        handleGenerateImage(data, 1)
    }

    const handleDownload = (DownloadUrl: string, FileName: string) => {
        fetch(DownloadUrl)
          .then(response => response.blob())
          .then(blob => {
            saveAs(blob, FileName);
          })
          .catch(error => {
            console.log('Error downloading file:', error);
          });
    };

    const handleGenerateImage = async (data: any, numberOfImages: number) => {
        if(auth.user && auth.user.token)  {
          setSendButtonDisable(true)
          setSendButtonText(t("Generating images...") as string)
          console.log("numberOfImages", numberOfImages)
          try {
            const ImageListData = await Promise.all(
              Array.from({ length: numberOfImages }, async () => {
                const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageFromImageStabilityAi/', data, {
                  headers: { Authorization: auth?.user?.token, 'Content-Type': 'multipart/form-data' },
                }).then(res => res.data);
                if(generateImageInfo && generateImageInfo.status == 'error') {
                    toast.error(t(generateImageInfo.msg), {
                        duration: 4000
                    })
                    if(generateImageInfo && generateImageInfo.msg=='Token is invalid') {
                      CheckPermission(auth, router, true)
                    }
                }
                console.log("generateImageInfo", generateImageInfo);
    
                return generateImageInfo;
              })
            );
            console.log("ImageListData:", ImageListData[0].id);
            if(ImageListData && ImageListData.length > 0 && ImageListData[0] && ImageListData[0].id) {
              setSendButtonDisable(false)
              setRefreshChatCounter(refreshChatCounter + 2)
              setSendButtonText(t("Generate images") as string)
              toast.success(t('Generate the image success'), {
                duration: 4000
              })
              setGenerateFileShow(authConfig.backEndApiChatBook + '/api/image/' + ImageListData[0].id)
            }
            else if(ImageListData && ImageListData.length > 0 && ImageListData[0]==null) {
              setSendButtonDisable(false)
              setSendButtonText(t("Generate images") as string)
              toast.error(t('Failed to generate the image, please modify your input parameters and try again'), {
                duration: 4000
              })
            }
            else {
              setSendButtonDisable(false)
              setSendButtonText(t("Generate images") as string)
            }
          } 
          catch (error) {
            setSendButtonDisable(false)
            setSendButtonText(t("Generate images") as string)
            console.log("handleGenerateImage Error fetching images:", error);
          }
        }
        else {
          toast.error(t("Please login first"), {
            duration: 4000
          })
          router.push('/login')
        }
      }
    
      const handleSubmitText = (Text: string) => {
        setSendButtonText(t(Text) as string)
      }
      
      /*
      const handleUpscaleStabilityAi = async (showImg: any) => {
        const data = { filename: showImg.filename }
        const generateImageInfo = await axios.post(authConfig.backEndApiChatBook + '/api/generateImageUpscaleStabilityAi/', data, {
          headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
        }).then(res => res.data);
        console.log("generateImageInfo", generateImageInfo);
        if(generateImageInfo && generateImageInfo.status == 'error') {
          toast.error(t(generateImageInfo.msg), {
            duration: 4000
          })
        }
        if(generateImageInfo && generateImageInfo.status == 'ok') {
          toast.success(t(generateImageInfo.msg), {
            duration: 4000
          })
        }
        setRefreshChatCounter(refreshChatCounter + 2)
      }
      */
  
    return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <DropzoneWrapper>
                <Grid container spacing={6} className='match-height' sx={{px:6, py:3}}>
                    <Grid item xs={12} >
                        {TopButtonList.map((Item: any, Index: number)=>{
                            return (
                            <Button key={Index} variant='contained' sx={{mr: 5, mt: 2, textTransform: 'capitalize'}} color={currentSection==Item.name?"primary":"secondary"} startIcon={<Icon icon={Item.icon} />} onClick={Item.onclick}>
                            {t(Item.name) as string}
                            </Button>
                            )
                        })}
                    </Grid>
                    <Grid item xs={6}>
                        {files.length ?
                        <Img alt='Upload img' sx={{maxWidth: '98%', borderRadius: 0.5}} src={URL.createObjectURL(files[0] as any)} />
                        :
                        <Img alt='Upload img' src={defaultImage} sx={{maxWidth: '98%', borderRadius: 0.5}} />
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {generateFileShow ? 
                        <Fragment>
                          <Img alt='Upload img' sx={{maxWidth: '98%', borderRadius: 0.5}} src={generateFileShow} />
                        </Fragment>
                        :
                        <Fragment>
                          <NewImageWrapper>
                            {sendButtonDisable ?
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
                              <CircularProgress size={50} />
                            </div>
                            :
                            <Fragment>
                              Generated image
                            </Fragment>
                            }
                          </NewImageWrapper>
                        </Fragment>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                                    {files.length ?
                                    <Img alt='Upload img' sx={{maxWidth: '100px', borderRadius: 0.5, mr: 2}} src={URL.createObjectURL(files[0] as any)} />
                                    :
                                    <Img alt='Upload img' src={defaultImage} sx={{maxWidth: '100px', borderRadius: 0.5, mr: 2}} />
                                    }
                                    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                                        <HeadingTypography variant='h5'>{`${t('Drop files here or click to upload.')}`}</HeadingTypography>
                                    </Box>
                                </Box>
                            </div>
                        </Grid>
                        <Grid item xs={12} sx={{mt: 3}} container justifyContent="center">
                            {t('Or use example images') as string}
                        </Grid>
                        <Grid item xs={12} sx={{mt: 3}} container justifyContent="center">
                            {RoomImageList && RoomImageList[currentSection] && RoomImageList[currentSection].map((Item: any, Index: number)=>{
                                return (
                                    <Box key={Index} display="flex" flexDirection="column" alignItems="center" sx={{ border: 0, mx: 3 }}>
                                        <Box display="flex" alignItems="center">
                                            <Img alt='' src={Item.url} sx={{ width: '100px', borderRadius: 1, cursor: 'pointer' }} onClick={Item.onclick}/>
                                        </Box>
                                        <Typography textAlign="center">{Item.name}</Typography>
                                    </Box>
                                    )
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs={12} sx={{}} container justifyContent="center">
                            <Grid container spacing={5} sx={{mb: 4}}>
                                <Grid item xs={12}>
                                <TextField multiline rows={5} fullWidth label={t('Prompt') as string} placeholder='' value={promptValue} onChange={(event: any)=>setPromptValue(event.target.value)}/>
                                </Grid>
                            </Grid>
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
                                    <TextField multiline rows={2} fullWidth label={t('Negative Prompt') as string} placeholder='' defaultValue={negativePromptValue} onChange={(event: any)=>setNegativePromptValue(event.target.value)}/>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
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
                                    <Grid item xs={6}>
                                    <TextField type="number" fullWidth label={t('Seed') as string} name='Seed' placeholder='' size="small" defaultValue={seedValue} value={seedValue} onChange={handleSeedChange}/>
                                    </Grid>
                                    <Grid item xs={6}>
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
                                    <Grid item xs={6}>
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
                                    <Grid item xs={6} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel >{t('Style') as string}</InputLabel>
                                        <Select
                                        label={t('Style') as string}
                                        defaultValue={styleValue}
                                        value={styleValue}
                                        size="small"
                                        onChange={handleStyleChange}
                                        >
                                        {StyleList.map((Item: any, Index: number)=>{
                                            return (<MenuItem key={Index} value={Item.value}>{Item.name}</MenuItem>)                          
                                        })}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel >Sampler</InputLabel>
                                        <Select
                                        label='Sampler'
                                        defaultValue={samplerValue}
                                        value={samplerValue}
                                        size="small"
                                        onChange={handleSamplerChange}
                                        >
                                        {SamplerList.map((Item: any, Index: number)=>{
                                            return (<MenuItem key={Index} value={Item.value}>{Item.name}</MenuItem>)                          
                                        })}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                                </AccordionDetails>
                            </Accordion>
                        
                            <Grid container spacing={5} sx={{ alignItems: 'center', mt: 2, justifyContent: 'center'}}>
                                <Grid item xs={12} sm={12}>                                    
                                    <Button size='medium' type='button' onClick={handleSubmit} variant='contained' sx={{ mr: 4 }} disabled={sendButtonDisable} >
                                    {sendButtonText}
                                    </Button>
                                    {generateFileShow ? 
                                      <Button variant='outlined' sx={{ mt: 1, mb: 2.5, mr: 3 }} size="small" onClick={()=>handleDownload(generateFileShow as string, 'Studio Image.png')} >{t('Download') as string}</Button>
                                    :
                                    null
                                    }
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </DropzoneWrapper>
          </Grid>
        </Grid>
    )
}

export default RoomDesign
