// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Axios Imports
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'

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

const FileUploaderSingle = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router)
  }, [])

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
      'image/png': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
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


  return (
    <Fragment>
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
    </Fragment>
  )
}

export default FileUploaderSingle
