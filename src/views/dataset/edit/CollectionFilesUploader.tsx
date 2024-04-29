// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

import CircularProgress from '@mui/material/CircularProgress'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Third Party Import
import { useTranslation } from 'react-i18next'


interface FileProp {
  name: string
  type: string
  size: number
}

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

const CollectionFilesUploader = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  
  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 100,
    maxSize: 51200000,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles.map((file: File) => Object.assign(file))]);
      uploadMultiFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
    onDropRejected: () => {
      toast.error('You can only upload 120 files', {
        duration: 4000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
    console.log("userId", userId)
  }
  
  const uploadMultiFiles = async (files: File[]) => {
    if (auth && auth.user) {
      console.log("uploadMultiFiles files", files)
      const formData = new FormData();
      formData.append('knowledgeId', knowledgeId);
      formData.append('knowledgeName', knowledgeName);
      files.map((file: File)=>{
        formData.append('files', file);
      })
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/uploadfiles', formData, {
        headers: {
          Authorization: auth.user.token,
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
      console.log("FormSubmit:", FormSubmit)
      
      if(FormSubmit.status == "ok") {

        toast.success(t(FormSubmit.msg) as string, { duration: 4000 })
        
      }
      else if(FormSubmit && FormSubmit.msg=='Token is invalid') {
        CheckPermission(auth, router, true)
      }
    }
  };

  useEffect(() => {
    let isFinishedAllUploaded = true
    uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).forEach(([key, value]) => {
        if(value != 100) {
            isFinishedAllUploaded = false
        }

        console.log("uploadProgress key ....", key, value)
    })
    if(uploadProgress && Object.entries(uploadProgress) && Object.entries(uploadProgress).length > 0 && isFinishedAllUploaded) {
        toast.success(t('Successfully submitted') as string, { duration: 4000 })
    }
    console.log("uploadProgress", uploadProgress)
  }, [uploadProgress])

  return (
    <Fragment>
      <DropzoneWrapper sx={{mt: 2}}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          <Img alt='Upload img' sx={{width: '160px'}} src='/images/misc/upload.png' />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h5'>{`${t('Drop files here or click to upload.')}`}</HeadingTypography>
            <Typography color='textSecondary'>
              {t('Support file type')}
            </Typography>
            <Typography color='textSecondary'>
            {t('Support max count')} {t('Support max size')}
            </Typography>
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <TableContainer component={Paper} variant="outlined" sx={{mt: 3}}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>{t('File Name')}</TableCell>
                    <TableCell>{t('File Size')}</TableCell>
                    <TableCell>{t('Upload file progress')}</TableCell>
                    <TableCell>{t('Actions')}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                  {files.map((file: FileProp, index: number)=>{    

                      return (
                          <TableRow key={index}>
                              <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                                {renderFilePreview(file)}
                                <Typography style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                              </TableCell>
                              <TableCell style={{ width: '20%', padding: 0, margin: 0 }}>
                                <Typography className='file-size' variant='body2'>
                                  {Math.round(file.size / 100) / 10 > 1000
                                    ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                                    : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                                </Typography>
                              </TableCell>
                              <TableCell style={{ width: '20%', padding: 0, margin: 0 }}>
                                {uploadProgress['UploadBundleFile'] && (
                                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                          <CircularProgress variant='determinate' {...{value: uploadProgress['UploadBundleFile']??0}} size={50} />
                                          <Box
                                          sx={{
                                              top: 0,
                                              left: 0,
                                              right: 0,
                                              bottom: 0,
                                              display: 'flex',
                                              position: 'absolute',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                          }}
                                          >
                                          <Typography variant='caption' component='div' color='text.secondary'>
                                              {uploadProgress['UploadBundleFile']??0}%
                                          </Typography>
                                          </Box>
                                      </Box>
                                )}
                              </TableCell>
                              <TableCell style={{ width: '10%', padding: 0, margin: 0 }}>                          
                                { uploadProgress['UploadBundleFile'] && uploadProgress['UploadBundleFile'] > 0 ?
                                    <Fragment></Fragment>
                                :
                                    <IconButton size="small" sx={{width: '28px', height: '28px', py: 0, my: 0}} onClick={() => handleRemoveFile(file)}>
                                        <Icon icon='mdi:close' fontSize={20} />
                                    </IconButton> 
                                }
                              </TableCell>
                          </TableRow>
                      )
                  })}
                </TableBody>
            </Table>
          </TableContainer>

        </Fragment>
      ) : null}
      </DropzoneWrapper>
    </Fragment>
  )
}

export default CollectionFilesUploader
