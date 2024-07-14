// ** React Imports
import { useState, useEffect, Fragment, ReactNode } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { saveAs } from 'file-saver'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import ReactMarkdown from 'react-markdown'
import CardMedia from '@mui/material/CardMedia'
import { useTheme } from '@mui/material/styles'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

import PerfectScrollbar from 'react-perfect-scrollbar'


// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { CheckPermission, downloadJson } from 'src/functions/ChatBook'
import { SSE } from 'src/functions/sse'
import base64js from 'base64-js'
import pako from 'pako'
import marked from 'marked'
import { useSettings } from 'src/@core/hooks/useSettings'

import "./lib/base64js.js";
import "./lib/chart.js";
import "./lib/geometry.js";
import "./lib/marked.js";
import "./lib/pako.js";
import "./lib/ppt2canvas.js";
import "./lib/ppt2svg.js";
import "./lib/sse.js";
import { pptxAllPages } from './data/pptx'


const apiKey = '9664f0ea9a4cee65c'

var pptxId = ''
var outline = ''
var templateId = ''
let selectIdx = 0
var mTimer: any = null


const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const PPTXModel = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
    //handleGetRandomTemplates()
  }, [])
  
  const { id } = router.query
  const theme = useTheme()
  
  // ** State
  const [pptxOutline, setPptxOutline] = useState<string>('');
  const [pptxOutlineResult, setPptxOutlineResult] = useState<string>('');
  const [pptxOutlineError, setPptxOutlineError] = useState<string>('');
  const [pptxRandomTemplates, setPptxRandomTemplates] = useState<any[]>([]);
  const [pptxObj, setPptxObj] = useState<any>({});
  const [pages, setPages] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<string>(t('Download PPTX') as string);
  const [step, setStep] = useState<number>(0);

  const handleGetRandomTemplates = async () => {
    const url = 'https://docmee.cn/api/public/ppt/randomTemplates?apiKey=' + apiKey
    const data = {page: 1, size: 10, filters: {type: 1} }
    const GetRandomTemplatesData = await axios.post(url, data, { headers: { Authorization: apiKey, 'Content-Type': 'application/json'} }).then(res=>res.data)
    console.log("GetRandomTemplatesData", GetRandomTemplatesData)
    if(GetRandomTemplatesData && GetRandomTemplatesData.data && GetRandomTemplatesData.data.length > 0) {
      setPptxRandomTemplates(GetRandomTemplatesData.data)
    }
  }
  console.log("pptxRandomTemplates", pptxRandomTemplates)

  const handleGeneratePPTXOutline = async () => {
    if(pptxOutline == '') {
      setPptxOutlineError('PPTX Outline must input')

      return
    }
    if(pptxOutline.length < 3) {
      setPptxOutlineError('PPTX Outline subject is too short')

      return
    }
    setPptxOutlineError('')

    const url = 'https://docmee.cn/api/public/ppt/generateOutline?apiKey=' + apiKey
    let outline = ''
    var source: any = new SSE(url, {
      method: 'POST',
      // withCredentials: true,
      headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
      },
      payload: JSON.stringify({ subject: pptxOutline }),
    })
    console.log("source", source)
    source.onmessage = function (data: any) {
        console.log("data", data)
        let json = JSON.parse(data.data)
        outline += json.text
        setPptxOutlineResult(outline)
        //document.getElementById('outline').innerHTML = window.marked.marked(outline)
        window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
    }
    source.onend = function (data: any) {
        console.log("onend", data.data)
        //document.getElementById('nextTo2').style.display = 'inline-block'
        //window.scrollTo(0, 0)
        console.log("pptxOutlineResult", pptxOutlineResult)
    }
    source.onerror = function (err: any) {
        console.error('生成大纲异常', err)
    }
    source.stream()

  }
  
  const handleGeneratePPTX = async (templateId: string) => {

    var markdownRenderer = new marked.Renderer()
      marked.setOptions({
          renderer: markdownRenderer,
          async: false, // 是否异步渲染
          gfm: true, // 运行github标准的markdown
          tables: true, // 表格
          breaks: false, // 回车换行
          pedantic: false, // 兼容隐晦部分
          silent: true // 错误时不抛异常
      })

    // canvas
    // var painter = new Ppt2Canvas('right_canvas')
    // var canvas = painter.getCanvas()

    // svg
    var painter: any = new Ppt2Svg('right_canvas')
    var canvas = painter.svgNode()
    painter.setMode('edit')

    var count = 0
    var timer = setInterval(() => {
        count = count + 1
        //document.getElementById('desc').style.display = 'block'
        //document.getElementById('desc_time').innerHTML = count + '秒'
    }, 1000)
    const url = 'https://docmee.cn/api/public/ppt/generateContent?apiKey=' + apiKey
    var source: any = new SSE(url, {
        method: 'POST',
        // withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        payload: JSON.stringify({ outlineMarkdown: pptxOutlineResult, asyncGenPptx: true, templateId }),
    })
    source.onmessage = function (data: any) {
        let json = JSON.parse(data.data)
        if (json.pptId) {
            //document.getElementById('desc_msg').innerText = `正在生成中，进度 ${json.current}/${json.total}，请稍后...`
            //asyncGenPptxInfo(json.pptId)
        }
    }
    source.onend = function (data: any) {
        clearInterval(timer)
        //document.getElementById('desc').style.display = 'none'
        //document.getElementById('pptDownload').style.display = 'inline-block'
        //drawPptxList()
    }
    source.onerror = function (err: any) {
        clearInterval(timer)
        console.error('生成内容异常', err)
        alert('生成内容异常')
    }
    source.stream()
  }

  const handleSetPptxPage = (pageId: number) => {
    const painter = new window.Ppt2Svg("right_canvas",undefined, undefined, pptxObj);
    painter.drawPptx(pptxObj, pageId)
    painter.svgNode();
    painter.setMode("edit");
  }

  const handleSaveJson = () => {
    setIsDisabled(true)
    downloadJson(pptxObj, pptxOutline + "000")
    setIsDisabled(false)
  }

  const handleDownloadJson = () => {
    setIsDisabled(true)
    downloadJson(pptxObj, pptxOutline + "000")
    setIsDisabled(false)
  }

  const handleDownloadPPTX = async () => {
    setIsDisabled(true)
    setIsDisabledText(t('Downloading...') as string)
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.open('POST', 'https://docmee.cn/api/public/ppt/json2ppt?apiKey=' + apiKey)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function() {
        if (this.status == 200) {
            let blob = this.response
            let a = document.createElement('a')
            a.href = window.URL.createObjectURL(blob)
            let name = 'download'
            a.download = name + '.pptx'
            a.click()
        }
        setIsDisabled(false)
        setIsDisabledText(t('Download PPTX') as string)
    }
    xhr.onerror = function (e) {
        console.error(e)
    }
    xhr.send(JSON.stringify(pptxObj))
  }

  useEffect(() => {
    let gzip = base64js.toByteArray(pptxAllPages)
    let json = pako.ungzip(gzip, { to: 'string' })
    const pptxAllPageData = JSON.parse(json)
    console.log("pptxAllPageData", pptxAllPageData);
      
    setPptxObj(pptxAllPageData)
    setPages(pptxAllPageData.pages.length)

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const painter = new window.Ppt2Svg("right_canvas",undefined, undefined, pptxAllPageData);
      painter.drawPptx(pptxAllPageData, 1)
      painter.svgNode();
      painter.setMode("edit");

      if(pptxAllPageData && pptxAllPageData.pages) {
        const renderPages = () => {
            for (let i = 0; i < pptxAllPageData.pages.length; i++) {
                let imgCanvas = document.getElementById('image_' + i)
                if (!imgCanvas) {
                    continue
                }
                try {
                    let _ppt2Canvas = new window.Ppt2Canvas(imgCanvas)
                    _ppt2Canvas.drawPptx(pptxAllPageData, i)
                } catch(e) {
                    console.log('渲染第' + (i + 1) + '页封面异常', e)
                }
            }
        }

        if (document.readyState === 'complete') {
            renderPages();
        } else {
            window.addEventListener('load', renderPages);
        }

        return () => {
            window.removeEventListener('load', renderPages);
        };

      }
    }

  }, [pptxAllPages]);


  // console.log("pptxOutlineResult", pptxOutlineResult)

  //, textAlign: 'center'

  const hidden = true
  
  const { settings } = useSettings()
  const { skin, direction } = settings

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ mt: 3,  height: '50px' }}>
        <Box sx={{ml: 3,  height: '1rem'}}>
          <Button variant='outlined' size="small" disabled={isDisabled} sx={{mr: 3}} onClick={() => handleSaveJson()}>
            Save Json
          </Button>
          <Button variant='outlined' size="small" disabled={isDisabled} sx={{mr: 3}} onClick={() => handleDownloadJson()}>
            Download Json
          </Button>
          <Button variant='contained' size="small" disabled={isDisabled} sx={{mr: 3}} onClick={() => handleDownloadPPTX()}>
            {isDisabledText}
          </Button>
        </Box>
      </Grid>
      {step == 0 && (
        <Fragment>
          <Grid item xs={2} sx={{ mt: 3 }}>
            <Box sx={{ p: 0, position: 'absolute', top: '55px', overflowX: 'hidden', height: 'calc(100% - 1rem)'}}>
              <Box sx={{
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                ml: 2,
                mr: 2,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.2)',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(155, 155, 155, 0.5)',
                  borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(155, 155, 155, 0.8)',
                },
              }}
              >
                {pages && Array.from({ length: pages }).map((_, index) => (
                  <div key={index} id={`left_image_${index}`} style={{cursor: 'pointer'}} onClick={() => handleSetPptxPage(index)}>
                    <canvas id={`image_${index}`} width="146" height="83" />
                  </div>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={9} sx={{ mt: 3 }}>
            <Box sx={{ p: 0, position: 'absolute', top: '55px', overflowX: 'hidden', height: 'calc(100% - 1rem)'}}>
              <svg id="right_canvas"></svg>
            </Box>
          </Grid>
        </Fragment>

      )}
    </Grid>
  )
}

export default PPTXModel

