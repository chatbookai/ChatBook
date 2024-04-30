// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import NewApp from 'src/views/dataset/my/NewApp'
import MyAppModel from 'src/views/dataset/my/MyAppModel'
import MyAppDelete from 'src/views/dataset/my/MyAppDelete'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getNanoid } from 'src/functions/app/string.tools'
import { useRouter } from 'next/router'
import { CheckPermission } from 'src/functions/ChatBook'


const MyApp = () => {

  // ** Hook
  const auth = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])
  
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [app, setApp] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [appId, setAppId] = useState<string>('')
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  useEffect(() => {
    if(auth && auth.user && auth.user.email) {
      getDatasetsPage(type, search)
    }
  }, [type, search, auth, refreshChatCounter])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setApp([])
    setType("ALL")
    setSearch(Item)
    setAppId("")
  }

  const getDatasetsPage = async function (type: string, search: string) {
    console.log("loadingAllData", loadingAllData)
    const pagesize = 20
    if(loadingAllData == false)  {
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getdatasetpage/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const appInitial: string[] = []
        RS.data.map((Item: any)=>{
          appInitial.push(Item)
        })
        if(RS.data.length < pagesize && pageid >= 0) {
          setLoadingAllData(true)
        }
        setApp([...app, ...appInitial].filter((element) => element != null))
        setAppId("")
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);  

      return () => {
        clearTimeout(timer);
      };
    }
    else {
      setLoading(true)
      setLoadingText('Finished')
      const timer2 = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => {
        clearTimeout(timer2);
      };
    }
  }

  const handleDeleteDataset = async function () {
    if(auth && auth.user && auth.user.token && appId)    {
      setDeleteOpen(false)
      setLoading(true)
      setIsDisabledButton(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/deletedataset', {datasetId: appId}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.status && RS.status == 'ok') {
        setLoading(false)
        toast.success(t(RS.msg) as string, { duration: 2500 })
        setRefreshChatCounter((prevState: number)=>(prevState+2))
        setPageid(0)
        setLoadingAllData(false)
        setApp([])
        setIsDisabledButton(false)
        setAppId("")
      }
      else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setPageid(pageid + 1)
      getDatasetsPage(type, search);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [app]); 

  const [NewOpen, setNewOpen] = useState<boolean>(false);
  const [AppNewForm, setAppNewForm] = useState<any>({name: t('My Dataset'), avatar: '', type: 'General', vectorModel: "Embedding-2", fileDealModel: 'gpt-3.5-turbo', })

  useEffect(() => {
    setAppNewForm((prevState: any)=>({
      ...prevState,
      name: t('My Dataset') as string
    }))
  }, [t]); 

  const handleAddApp = async () => {
    console.log("AppNewForm", AppNewForm)
    
    if (auth && auth.user) {
      setNewOpen(false)
      const code = getNanoid(32)
      let simpleAppNewForm: any = {}
      simpleAppNewForm = {
        ...AppNewForm,
        _id: code,
      }
      const PostParams = {name: simpleAppNewForm.name, _id: simpleAppNewForm._id, intro: simpleAppNewForm.intro, avatar: simpleAppNewForm.avatar, type: simpleAppNewForm.type, vectorModel: simpleAppNewForm.vectorModel, fileDealModel: simpleAppNewForm.fileDealModel}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/adddataset', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      if(FormSubmit && FormSubmit.status == 'ok' && code)  {
        toast.success(t(FormSubmit.msg) as string, { duration: 2500 })
        router.push('/dataset/collection/' + code)
      }
    }
  }

  return (
    <Fragment>
      <MyAppModel app={app} loading={loading} loadingText={loadingText} appId={appId} setAppId={setAppId} show={show} setShow={setShow} setDeleteOpen={setDeleteOpen} handleDeleteDataset={handleDeleteDataset} handleSearchFilter={handleSearchFilter} setNewOpen={setNewOpen}/>
      <NewApp NewOpen={NewOpen} setNewOpen={setNewOpen} handleAddApp={handleAddApp} AppNewForm={AppNewForm} setAppNewForm={setAppNewForm}/>
      <MyAppDelete deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} isDisabledButton={isDisabledButton} handleDeleteDataset={handleDeleteDataset}/>
    </Fragment>
  )
}


export default MyApp
