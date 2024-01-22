// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'

// ** Demo Components Imports
import FileUploaderMultiple from 'src/views/form/FileUploaderMultiple'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const UploadFilesContent = (props: any) => {
  // ** Props
  const { knowledgeId, knowledgeName, userId } = props

  // ** Hook
  const { t } = useTranslation()
  
  return (
    <DropzoneWrapper>
      <Grid container spacing={6} className='match-height' sx={{px:6, py:3}}>
        <PageHeader
          title={
            <Typography variant='h5'>
              {knowledgeName} {`${t('Upload Files')}`}
            </Typography>
          }
          subtitle={<Typography variant='body2' sx={{pt:2}}>{`${t('You can choose multiple files for simultaneous uploading.')}`}</Typography>}
        />
        <Grid item xs={12}>
            <FileUploaderMultiple knowledgeId={knowledgeId} knowledgeName={knowledgeName} userId={userId} />
        </Grid>
      </Grid>
    </DropzoneWrapper>
  )
}

export default UploadFilesContent
