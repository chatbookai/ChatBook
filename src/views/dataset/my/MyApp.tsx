// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AppModel from 'src/views/dataset/my/MyAppModel'
import NewApp from 'src/views/dataset/my/NewApp'

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
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [app, setApp] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [agent, setAgent] = useState<any>(null)
  
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
        setFavoriteList(RS.favorite)
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

  const handleDeleteDataset = async function (id: string) {
    if(auth && auth.user && auth.user.token && id)    {
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/deletedataset', {datasetId: id}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.status && RS.status == 'ok') {
        setLoading(false)
        toast.success(t(RS.msg) as string, { duration: 2500 })
        setRefreshChatCounter((prevState: number)=>(prevState+2))
        setPageid(0)
        setLoadingAllData(false)
        setApp([])
      }
      else {
        setLoading(false)
      }
    }
  }

  const handleAddUserAgentAndChat  = async function () {
    setShow(false)
    console.log("打开会话")
  }

  const handleAddUserAgent  = async function () {
    setShow(false)
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
      <AppModel app={app} favoriteList={favoriteList} loading={loading} loadingText={loadingText} agent={agent} setAgent={setAgent} show={show} setShow={setShow} handleAddUserAgentAndChat={handleAddUserAgentAndChat} handleAddUserAgent={handleAddUserAgent} handleDeleteDataset={handleDeleteDataset} handleSearchFilter={handleSearchFilter} setNewOpen={setNewOpen}/>
      <NewApp NewOpen={NewOpen} setNewOpen={setNewOpen} handleAddApp={handleAddApp} AppNewForm={AppNewForm} setAppNewForm={setAppNewForm}/>
    </Fragment>
  )
}


export default MyApp
