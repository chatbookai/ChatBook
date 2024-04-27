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


const MyApp = () => {

  // ** Hook
  const auth = useAuth()
  const { t } = useTranslation()
  const router = useRouter()
  
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [app, setApp] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [agent, setAgent] = useState<any>(null)
  const [userAgents, setUserAgents] = useState<number[]>([])
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  useEffect(() => {
    getApp(type, search)
    getUserAgents()    
  }, [type, search])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setApp([])
    setType("ALL")
    setSearch(Item)
  }

  const getApp = async function (type: string, search: string) {
    console.log("loadingAllData", loadingAllData)
    if(loadingAllData == false)  {
      const pagesize = 20
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/agents/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const appInitial: string[] = []
        RS.data.map((Item: any)=>{
          appInitial.push(Item)
        })
        if(RS.data.length < pagesize && pageid > 0) {
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

  const addUserAgent = async function () {
    if(auth && auth.user && auth.user.token && agent)    {
      setLoading(true)
      const data: any = {agentId: agent.id}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/agent/add', data, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.status && RS.status == 'ok') {
        setLoading(false)
        const newUserAgentsSet = new Set(userAgents);
        newUserAgentsSet.add(agent.id);
        setUserAgents(Array.from(newUserAgentsSet));
        toast.success(t(RS.msg) as string, { duration: 2500 })
      }
      else {
        setLoading(false)
      }
    }
  }

  const deleteUserAgent = async function () {
    if(auth && auth.user && auth.user.token && agent)    {
      setLoading(true)
      const data: any = {agentId: agent.id}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/agent/delete', data, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.status && RS.status == 'ok') {
        setLoading(false)
        const updatedUserAgents = userAgents.filter(id => id !== agent.id);
        setUserAgents(updatedUserAgents);
        toast.success(t(RS.msg) as string, { duration: 2500 })
      }
      else {
        setLoading(false)
      }
    }
  }

  const handelAddUserAgentAndChat  = async function () {
    addUserAgent()
    setShow(false)
    console.log("打开会话")
  }

  const handelAddUserAgent  = async function () {
    addUserAgent()
    setShow(false)
  }

  const handelCancelUserAgent  = async function () {
    deleteUserAgent()
    setShow(false)
  }

  const getUserAgents = async function () {
    if(auth && auth.user && auth.user.token)    {
      setLoading(true)
      const data: any = {pageid: 0, pagesize: 999}
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/user/agents', data, {
        headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        setLoading(false)
        const InitialUserAgents = RS.data.map((Item: any)=>Item.agentId)
        setUserAgents(InitialUserAgents)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setPageid(pageid + 1)
      getApp(type, search);
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
      let simpleChatNew: any = {}
      if(AppNewForm.flowType == 'simpleChat')  {
        simpleChatNew = {
          ...simpleChat,
          id: code,
          _id: code,
          teamId: code,
          updateTime: String(new Date(Date.now()).toLocaleString())
        }
      }
      const PostParams = {name: AppNewForm.name, _id: simpleChatNew._id, teamId: simpleChatNew.teamId, intro: simpleChatNew.intro, avatar: simpleChatNew.avatar, type: simpleChatNew.type, flowGroup: AppNewForm.flowGroup, permission: simpleChatNew.permission, data: simpleChatNew}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/addapp', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      if(FormSubmit && FormSubmit.status == 'ok' && code)  {
        toast.success(t(FormSubmit.msg) as string, { duration: 2500 })
        router.push('/app/edit/' + code)
      }
    }
  }

  return (
    <Fragment>
      <AppModel app={app} favoriteList={favoriteList} loading={loading} loadingText={loadingText} agent={agent} setAgent={setAgent} show={show} setShow={setShow} handelAddUserAgentAndChat={handelAddUserAgentAndChat} handelAddUserAgent={handelAddUserAgent} handelCancelUserAgent={handelCancelUserAgent} handleSearchFilter={handleSearchFilter} userAgents={userAgents} setNewOpen={setNewOpen}/>
      <NewApp NewOpen={NewOpen} setNewOpen={setNewOpen} handleAddApp={handleAddApp} AppNewForm={AppNewForm} setAppNewForm={setAppNewForm}/>
    </Fragment>
  )
}


export default MyApp
