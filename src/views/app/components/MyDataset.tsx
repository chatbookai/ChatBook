import { useEffect, memo, useState, Fragment } from 'react'

import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Slider from '@mui/material/Slider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { GetAllMyDataset } from 'src/functions/ChatBook'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

import CustomCheckboxBasic from 'src/@core/components/custom-checkbox/basic'

const MyDataset = (props: any) => {
    // ** Props
    const {MyDataset, setMyDataset, ModelData, handleMyDatasetChange, index } = props

    // ** Hook
    const { t } = useTranslation()
    const auth = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        CheckPermission(auth, router, false)
    }, [auth, router])

    const [AllMyDataset, setAllMyDataset] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            if(auth && auth.user && auth.user.token)  {
                const MyDatasetListData = await GetAllMyDataset(auth.user.token)
                console.log("MyDatasetListData", MyDatasetListData)
                const tempData: any[] = []
                MyDatasetListData && MyDatasetListData.data && MyDatasetListData.data.length>0 && MyDatasetListData.data.map((item: any, index: number)=>{
                    tempData.push({
                        meta: item.vectorModel,
                        isSelected: true,
                        value: item._id,
                        title: item.name,
                        content: item.intro.length>100 ? item.intro.substring(0, 110)+"..." : item.intro
                      })
                })
                setAllMyDataset(tempData)
            }
        };
        fetchData();
    }, [])

    /*
    const data: any[] = [
        {
          meta: '20%',
          isSelected: true,
          value: 'discount',
          title: 'Discount',
          content: 'Wow! Get 20% off on your next purchase!'
        }
    ]
    */

    const MyDatasetIdInitialSelected: string[] = MyDataset.MyDatasetList.map((item: any) => item.value)
    const handleChange = (name: string, value: string) => {
        const MyDatasetIdSelected: string[] = MyDataset.MyDatasetList.map((item: any) => item.value)
        //console.log("MyDatasetListMyDatasetList0", MyDatasetIdSelected, value)
        if (MyDatasetIdSelected.includes(value)) {
            const MyDatasetList = MyDataset.MyDatasetList.filter((item: any) => item.value !== value)
            //console.log("MyDatasetListMyDatasetList1", MyDatasetList)
            setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetList }) )
        } else {
            const MyDatasetList = [...MyDataset.MyDatasetList]
            MyDatasetList.push({name, value})
            //console.log("MyDatasetListMyDatasetList2", MyDatasetList)
            setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetList }) )
        }
    }

    return (
        <Dialog fullWidth open={MyDataset.MyDatasetOpen} onClose={
            () => { setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetOpen: false }) ) }
        }>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                <Avatar src={'/icons/core/app/simpleMode/tts.svg'} variant="rounded" sx={{ width: '25px', height: '25px', pl: 1}} />
                <Typography sx={{pl: 2}}>{t('Select dataset') as string}</Typography>
                <Box position={'absolute'} right={'5px'} top={'1px'}>
                    <IconButton size="small" edge="end" onClick={
                        () => { setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetOpen: false }) ) }
                    } aria-label="close">
                    <CloseIcon />
                    </IconButton>
                </Box>
                </Box>
            </DialogTitle>
            <DialogContent sx={{  }}>
                <Grid item xs={12}>
                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            {AllMyDataset.map((item, index) => (
                                <CustomCheckboxBasic
                                key={index}
                                data={AllMyDataset[index]}
                                selected={MyDatasetIdInitialSelected}
                                handleChange={()=>handleChange(item.title, item.value)}
                                name='custom-checkbox-basic'
                                gridProps={{ sm: 12, xs: 12, m: 3 }}
                                />
                            ))}
                            {AllMyDataset && AllMyDataset.map((item: any, index: number)=>{
                                
                                return (
                                    <Fragment>
                                        {item.name}
                                    </Fragment>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button size="small" variant='contained' onClick={
                    () => { 
                        setMyDataset( (prevState: any) => ({ ...prevState, MyDatasetOpen: false }) ) 
                        handleMyDatasetChange(index, MyDataset)
                    }
                }>
                {t("Confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(MyDataset);
