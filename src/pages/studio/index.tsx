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


// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import FileUploaderSingle from 'src/views/form/FileUploaderSingle'

// ** Third Party Import
import { useTranslation } from 'react-i18next'


// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(15.75)
    },
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

    const TopButtonList: any[] = [
        {name: 'Real-time Design', color:'primary', icon: 'material-symbols:rocket-launch-outline', onclick: ()=>handleSwitchButtonSection('Real-time Design') },
        {name: 'Hi-Fi Redesign', color:'secondary', icon: 'icon-park-solid:all-application', onclick: ()=>handleSwitchButtonSection('Hi-Fi Redesign') },
        {name: 'Partial Remodel', color:'secondary', icon: 'streamline:application-add-solid', onclick: ()=>handleSwitchButtonSection('Partial Remodel') },
        {name: 'Cabinet Design', color:'secondary', icon: 'bx:cabinet', onclick: ()=>handleSwitchButtonSection('Cabinet Design') },
        {name: 'Wall & Flooring', color:'secondary', icon: 'mdi:wall', onclick: ()=>handleSwitchButtonSection('Wall & Flooring') },
        {name: 'More', color:'secondary', icon: 'material-symbols:more-vert', onclick: ()=>handleSwitchButtonSection('More') }
    ]

    const handleSwitchButtonSection = (buttonSection: string) => {
        console.log("buttonSection", buttonSection)
        setCurrentSection(buttonSection)
        setCurrentSectionColor(buttonSection)
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
                    <PageHeader
                    title={
                        <Typography variant='h5'>
                        {`${t('Upload Files')}`}
                        </Typography>
                    }
                    subtitle={<Typography variant='body2' sx={{pt:2}}>{`${t('Up to 10 files can be uploaded at one time')}`}</Typography>}
                    />
                    <Grid item xs={8}>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                                {files.length ?
                                <Img alt='Upload img' sx={{maxWidth: '98%', borderRadius: 0.5}} src={URL.createObjectURL(files[0] as any)} />
                                :
                                <Fragment>
                                    <Img alt='Upload img' src='/images/misc/upload.png' sx={{borderRadius: 0.5}} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                                        <HeadingTypography variant='h5'>{`${t('Drop files here or click to upload.')}`}</HeadingTypography>
                                    </Box>
                                </Fragment>
                                }
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            </DropzoneWrapper>
          </Grid>
        </Grid>
    )
}

export default UploadFilesContent
