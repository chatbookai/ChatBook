// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AgentList from 'src/views/agents/AgentList'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const AppChat = () => {

  // ** Hook
  const auth = useAuth()
  const { t } = useTranslation()
  
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [agentList, setAgentList] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [agent, setAgent] = useState<any>(null)
  const [userAgents, setUserAgents] = useState<number[]>([])
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  const TypeList = "全部,写作,代码,软件开发,技术,英语,企业,研究,沟通,联网,前端,电子商务,人工智能,设计师,Typescript"

  useEffect(() => {
    getAgentList(type, search)
    getUserAgents()    
  }, [type, search])

  const handleTypeFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setAgentList([])
    setType(Item)
  }

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setAgentList([])
    setType("ALL")
    setSearch(Item)
  }

  const getAgentList = async function (type: string, search: string) {
    console.log("loadingAllData", loadingAllData)
    if(loadingAllData == false)  {
      const pagesize = 20
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/agents/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const agentListInitial: string[] = []
        RS.data.map((Item: any)=>{
          agentListInitial.push(Item)
        })
        if(RS.data.length < pagesize && pageid >= 0) {
          setLoadingAllData(true)
        }
        setAgentList([...agentList, ...agentListInitial].filter((element) => element != null))
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
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
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
        toast.success(t(RS.msg) as string, { duration: 2500, position: 'top-center' })
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
      getAgentList(type, search);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [agentList]); 

  return (
    <Fragment>
      <AgentList agentList={agentList} favoriteList={favoriteList} loading={loading} loadingText={loadingText} agent={agent} setAgent={setAgent} show={show} setShow={setShow} handelAddUserAgentAndChat={handelAddUserAgentAndChat} handelAddUserAgent={handelAddUserAgent} handelCancelUserAgent={handelCancelUserAgent} TypeList={TypeList} handleTypeFilter={handleTypeFilter} handleSearchFilter={handleSearchFilter} userAgents={userAgents}/>
    </Fragment>
  )
}


export default AppChat
