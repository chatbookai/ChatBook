import { Fragment, Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import Container from '@mui/material/Container';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Import
import { useTranslation } from 'react-i18next'


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

const UploadFilesContent = (props: any) => {
    // ** Props
    const { userId } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    useEffect(() => {
        CheckPermission(auth, router)
    }, [])

    const [currentSection, setCurrentSection] = useState<string>("Real-time Design")
    const [currentSectionColor, setCurrentSectionColor] = useState<string>("primary")
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
    }, [currentSection])

    const handleSwitchButtonSection = (buttonSection: string) => {
        setCurrentSection(buttonSection)
        setCurrentSectionColor(buttonSection)
    }

    const handleSwitchDefaultImage = (ImageUrl: string) => {
        setFiles([])
        setDefaultImage(ImageUrl)
    }

    const [files, setFiles] = useState<File[]>([])
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
        }
    })
  
    return (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
            <DropzoneWrapper>
                <Grid container spacing={6} className='match-height' sx={{px:6, py:3}}>
                    <Grid item xs={12} >
                        {TopButtonList.map((Item: any, Index: number)=>{
                            return (
                            <Button key={Index} variant='contained' sx={{mr: 5, mt: 2}} color={currentSection==Item.name?"primary":"secondary"} startIcon={<Icon icon={Item.icon} />} onClick={Item.onclick}>
                            {Item.name}
                            </Button>
                            )
                        })}
                    </Grid>
                    <Grid item xs={6}>
                        {files.length ?
                        <Img alt='Upload img' sx={{maxWidth: '98%', borderRadius: 0.5}} src={URL.createObjectURL(files[0] as any)} />
                        :
                        <Img alt='Upload img' src={defaultImage} sx={{maxWidth: '98%', borderRadius: 4}} />
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
                        <Grid item xs={12} sx={{mt: 6}} container justifyContent="center">
                            Or use example images
                        </Grid>
                        <Grid item xs={12} sx={{mt: 6}} container justifyContent="center">
                            {RoomImageList && RoomImageList[currentSection] && RoomImageList[currentSection].map((Item: any, Index: number)=>{
                                return (
                                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ border: 0, mx: 3 }}>
                                        <Box display="flex" alignItems="center">
                                            <Img alt='' src={Item.url} sx={{ width: '100px', borderRadius: 1, cursor: 'pointer' }} onClick={Item.onclick}/>
                                        </Box>
                                        <Typography textAlign="center">{Item.name}</Typography>
                                    </Box>
                                    )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </DropzoneWrapper>
          </Grid>
        </Grid>
    )
}

export default UploadFilesContent
