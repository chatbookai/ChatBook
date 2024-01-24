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

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

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

const FileUploaderMultiple = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()

  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [uploadingButton, setUploadingButton] = useState<string>(`${t(`Upload Files`)}`)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [removeAllButton, setRemoveAllButton] = useState<string>(`${t(`Remove All`)}`)
  const [isDisabledRemove, setIsDisabledRemove] = useState<boolean>(false)
  
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
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setIsDisabledButton(false)
      setUploadingButton(`${t(`Upload Files`)}`)      
      setRemoveAllButton(`${t(`Remove All`)}`)
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
  
  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
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
      { uploadProgress['UploadBundleFile'] && uploadProgress['UploadBundleFile'] > 0 ?
            <Fragment></Fragment>
        :
            <IconButton onClick={() => handleRemoveFile(file)}>
                <Icon icon='mdi:close' fontSize={20} />
            </IconButton> 
        }
      
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])    
    setIsDisabledButton(false)
    setIsDisabledRemove(false)
    setUploadingButton(`${t(`Upload Files`)}`)
    setUploadProgress({})
  }

  const handleUploadAllFiles = () => {
    setIsDisabledButton(true)
    setIsDisabledRemove(true)
    setUploadingButton(`${t(`Uploading`)}...`)
    uploadMultiFiles();
  }

  const uploadMultiFiles = async () => {

    const formData = new FormData();
    console.log("files", files)
    formData.append('knowledgeId', knowledgeId);
    formData.append('knowledgeName', knowledgeName);
    files.map((file: File)=>{
      formData.append('files', file);
    })
    const FormSubmit: any = await axios.post(authConfig.backEndApi + '/uploadfiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
    console.log("FormSubmit:", FormSubmit)
    
    
    if(FormSubmit.status == "ok") {
      //Insufficient balance
      toast.success(FormSubmit.msg, { duration: 4000 })
      setIsDisabledButton(false)
      setIsDisabledRemove(false)
      setUploadingButton(`${t(`Upload Files`)}`)
      handleRemoveAllFiles()
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
        setIsDisabledButton(true)
        setIsDisabledRemove(false)
        setUploadingButton(t("Upload success") as string)
        setRemoveAllButton(t("Clean Records") as string)        
        toast.success(t('Successfully submitted') as string, { duration: 4000 })
    }
  }, [uploadProgress])

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          <Img alt='Upload img' src='/images/misc/upload.png' />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant='h5'>{`${t('Drop files here or click to upload.')}`}</HeadingTypography>
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles} disabled={isDisabledRemove}>{removeAllButton}</Button>
            <Button variant='contained' onClick={handleUploadAllFiles} disabled={isDisabledButton}>{uploadingButton}</Button>
          </div>
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default FileUploaderMultiple
