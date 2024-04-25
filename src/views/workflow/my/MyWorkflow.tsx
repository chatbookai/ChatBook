// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import WorkflowModel from 'src/views/workflow/my/MyWorkflowModel'
import NewWorkflow from 'src/views/workflow/my/NewWorkflow'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { getNanoid } from 'src/functions/workflow/string.tools'
import { simpleChat } from '../data/simpleChat';


const MyWorkflow = () => {

  // ** Hook
  const auth = useAuth()
  const { t } = useTranslation()
  
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [workflow, setWorkflow] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [agent, setAgent] = useState<any>(null)
  const [userAgents, setUserAgents] = useState<number[]>([])
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  useEffect(() => {
    getWorkflow(type, search)
    getUserAgents()    
  }, [type, search])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setWorkflow([])
    setType("ALL")
    setSearch(Item)
  }

  const getWorkflow = async function (type: string, search: string) {
    console.log("loadingAllData", loadingAllData)
    if(loadingAllData == false)  {
      const pagesize = 20
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/agents/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const workflowInitial: string[] = []
        RS.data.map((Item: any)=>{
          workflowInitial.push(Item)
        })
        if(RS.data.length < pagesize && pageid > 0) {
          setLoadingAllData(true)
        }
        setWorkflow([...workflow, ...workflowInitial].filter((element) => element != null))
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
      getWorkflow(type, search);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [workflow]); 

  const [NewOpen, setNewOpen] = useState<boolean>(false);
  const [WorkflowNewForm, setWorkflowNewForm] = useState<any>({name: t('My App'), flowType: 'simpleChat', flowGroup: "Default"})

  useEffect(() => {
    setWorkflowNewForm((prevState: any)=>({
      ...prevState,
      name: t('My App') as string
  }))
  }, [t]); 

  const handleAddWorkflow = async () => {
    console.log("WorkflowNewForm", WorkflowNewForm)
    //Backend Api
    if (auth && auth.user) {
      const code = getNanoid(32)
      let simpleChatNew: any = {}
      if(WorkflowNewForm.flowType == 'simpleChat')  {
        simpleChatNew = {
          ...simpleChat,
          id: code,
          _id: code,
          teamId: code,
          updateTime: String(new Date(Date.now()).toLocaleString())
        }
      }
      const PostParams = {name: WorkflowNewForm.name, _id: simpleChatNew._id, teamId: simpleChatNew.teamId, intro: simpleChatNew.intro, avatar: simpleChatNew.avatar, type: simpleChatNew.type, flowGroup: WorkflowNewForm.flowGroup, permission: simpleChatNew.permission, data: simpleChatNew}
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/addworkflow', PostParams, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
    }
  }

  return (
    <Fragment>
      <WorkflowModel workflow={workflow} favoriteList={favoriteList} loading={loading} loadingText={loadingText} agent={agent} setAgent={setAgent} show={show} setShow={setShow} handelAddUserAgentAndChat={handelAddUserAgentAndChat} handelAddUserAgent={handelAddUserAgent} handelCancelUserAgent={handelCancelUserAgent} handleSearchFilter={handleSearchFilter} userAgents={userAgents} setNewOpen={setNewOpen}/>
      <NewWorkflow NewOpen={NewOpen} setNewOpen={setNewOpen} handleAddWorkflow={handleAddWorkflow} WorkflowNewForm={WorkflowNewForm} setWorkflowNewForm={setWorkflowNewForm}/>
    </Fragment>
  )
}


export default MyWorkflow
