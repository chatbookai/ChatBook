// ** MUI Imports
import React, { Fragment } from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Icon Imports
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { useTranslation } from 'next-i18next'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

const DatasetTypesList: any[] = [
    {
      type: 'General',
      avatar: '/imgs/module/AI.png',
      name: 'Common Dataset',
      intro: 'Common Dataset Desc',
    },
    {
      type: 'Web',
      avatar: '/imgs/module/userGuide.png',
      name: 'Website Dataset',
      intro: 'Website Dataset Desc',
    }
]

const VectorModelList: string[] = ["Embedding-2"]
const FileDealModelList: string[] = ["gpt-3.5-turbo"]

const NewApp = ({ NewOpen, setNewOpen, handleAddApp, AppNewForm, setAppNewForm }: any) => {
  const { t } = useTranslation()
  
  return (
    <Dialog maxWidth='xs' fullWidth open={NewOpen} onClose={
        () => { setNewOpen(false) }
    }>
        <DialogTitle>
            <Box display="flex" alignItems="center">
            <Typography >{t('New Dataset') as string}</Typography>
            <Box position={'absolute'} right={'5px'} top={'1px'}>
                <IconButton size="small" edge="end" onClick={
                    () => { setNewOpen(false) }
                } aria-label="close">
                <CloseIcon />
                </IconButton>
            </Box>
            </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
            <Fragment>
                <Grid item sx={{pt: 1}} xs={12}>
                    <Box display="flex" mb={1} alignItems="center">
                        <Typography sx={{pb: 1}}>{t('Dataset Type') as string}</Typography>
                        <span style={{ paddingTop: '10px', color: 'red', marginLeft: '3px' }}>*</span>
                    </Box>
                    
                    {DatasetTypesList.map((item: any, index: number) => {
                        
                        return (
                            <Fragment key={index}>
                                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', my: 2, px: 2, pt: 1, borderRadius: '8px', border: theme => `${item.type === AppNewForm.type ? '3px dashed' : '1px solid'}  ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}` }}
                                    onClick={()=>{
                                        setAppNewForm((prevState: any)=>({
                                            ...prevState,
                                            type: item.type as string
                                        }))
                                    }} >
                                    <Avatar src={item.avatar} sx={{ mr: 3, width: 42, height: 42 }} />
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            pb: 4
                                        }}
                                    >
                                        <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                                            <Typography sx={{ 
                                                fontWeight: 500,
                                                lineHeight: 1.71,
                                                letterSpacing: '0.22px',
                                                fontSize: '0.875rem !important',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap' 
                                            }} >
                                                {t(item.name)}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    '& svg': { mr: 1, color: 'text.secondary', verticalAlign: 'middle' }
                                                }}
                                            >
                                                <Typography 
                                                    variant='caption' 
                                                    sx={{ 
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {t(item.intro)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Fragment>
                        );
                    })}
                </Grid>
                <Grid item sx={{pt: 0}} xs={12}>
                    <Box display="flex" mb={1} alignItems="center">
                        <Typography sx={{pb: 1}}>{t('Name') as string}</Typography>
                        <span style={{ paddingTop: '5px', color: 'red', marginLeft: '3px' }}>*</span>
                    </Box>
                    <TextField
                        size='small'
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                        value={AppNewForm.name}
                        sx={{ width: '100%', resize: 'both', '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                        onChange={(e: any) => {
                            setAppNewForm((prevState: any)=>({
                                ...prevState,
                                name: e.target.value as string
                            }))
                            console.log("e.target.value", e.target.value);
                        }}
                    />
                </Grid>
                <Grid item sx={{pt: 1}} xs={12}>
                    <Box display="flex" mb={1} alignItems="center">
                        <Typography sx={{pb: 1}}>{t('Vector Model') as string}</Typography>
                        <span style={{ paddingTop: '5px', color: 'red', marginLeft: '3px' }}>*</span>
                    </Box>
                    <Select 
                        size="small" 
                        value={AppNewForm.vectorModel}
                        fullWidth
                        onChange={(e: any) => {
                            if(e.target.value != null) {
                                setAppNewForm((prevState: any)=>({
                                    ...prevState,
                                    vectorModel: e.target.value as string
                                }))
                            }
                        }}
                        >
                        {VectorModelList.map((item: any, indexItem: number)=>{
                            return <MenuItem value={item} key={`${indexItem}`}>{item}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item sx={{pt: 1}} xs={12}>
                    <Box display="flex" mb={1} alignItems="center">
                        <Typography sx={{pb: 1}}>{t('File Deal Model') as string}</Typography>
                        <span style={{ paddingTop: '5px', color: 'red', marginLeft: '3px' }}>*</span>
                    </Box>
                    <Select 
                        size="small" 
                        value={AppNewForm.fileDealModel}
                        fullWidth
                        onChange={(e: any) => {
                            if(e.target.value != null) {
                                setAppNewForm((prevState: any)=>({
                                    ...prevState,
                                    fileDealModel: e.target.value as string
                                }))
                            }
                        }}
                        >
                        {FileDealModelList.map((item: any, indexItem: number)=>{
                            return <MenuItem value={item} key={`${indexItem}`}>{item}</MenuItem>
                        })}
                    </Select>
                </Grid>
            </Fragment>
        </DialogContent>
        <DialogActions>
            <Button size="small" variant='outlined' onClick={
                () => { setNewOpen(false) }
            }>
            {t("Cancel")}
            </Button>
            <Button size="small" variant='contained' onClick={
                () => { 
                    setNewOpen(false)
                    handleAddApp() 
                }
            }>
            {t("Confirm")}
            </Button>
        </DialogActions>
    </Dialog>
  )
}

export default NewApp
