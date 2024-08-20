// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import ReactMarkdown from 'react-markdown'
import CardMedia from '@mui/material/CardMedia'
import { useTheme } from '@mui/material/styles'

// ** Next Import
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { CheckPermission, downloadJson } from 'src/functions/ChatBook'
import base64js from 'base64-js'
import pako from 'pako'

// @ts-ignore
import "./lib/chart.js";

// @ts-ignore
import "./lib/geometry.js";

// @ts-ignore
import "./lib/ppt2canvas.js";

// @ts-ignore
import "./lib/ppt2svg.js";

// @ts-ignore
import "./lib/sse.js";

const apiKey = 'ak_6J7pisEET3pvE914YC'
const uid = 'test'

const PPTXModel = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
    //handleGetRandomTemplates()
  }, [])
  
  const theme = useTheme()
  
  // ** State
  const [pptxOutline, setPptxOutline] = useState<string>('');
  const [pptxOutlineResult, setPptxOutlineResult] = useState<string>('');
  const [pptxOutlineError, setPptxOutlineError] = useState<string>('');
  const [pptxRandomTemplates, setPptxRandomTemplates] = useState<any[]>([]);
  const [pptxRandomTemplates6, setPptxRandomTemplates6] = useState<any[]>([]);
  const [pptxObj, setPptxObj] = useState<any>({});
  const [pages, setPages] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isDisabledText, setIsDisabledText] = useState<string>(t('Download PPTX') as string);
  const [step, setStep] = useState<number>(0);
  
  const [token, setToken] = useState<string>('')

  async function createApiToken() {
    try {
      const url = 'https://docmee.cn/api/user/createApiToken'
      const resp = await (await fetch(url, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid,
          limit: null
        })
      })).json()
      
      console.log("resp", resp)
      if(resp && resp.data && resp.data.token)  {
        setToken(resp.data.token)
      }
    }
    catch(Error: any) {
      console.log("createApiToken Error", Error)
    }
  }

  useEffect(() => {
    createApiToken()
  }, [])


  useEffect(() => {
    if(pptxObj && pptxObj.pages) {
      const renderPages = () => {
          const painter = new window.Ppt2Svg("right_canvas",undefined, undefined, pptxObj);
          for (let i = 0; i < pptxObj.pages.length; i++) {
            const imgCanvas = document.getElementById('image_' + i)
              if (!imgCanvas) {
                  continue
              }
              try {
                const _ppt2Canvas = new window.Ppt2Canvas(imgCanvas)
                  _ppt2Canvas.drawPptx(pptxObj, i)
              } catch(e) {
                  console.log('渲染第' + (i + 1) + '页封面异常', e)
              }
              painter.drawPptx(pptxObj, i)
              painter.svgNode();
              painter.setMode("edit");
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
  }, [pptxObj])
  
  const handleGetRandomTemplates = async () => {
    try {
      
      const url = 'https://docmee.cn/api/ppt/randomTemplates'
      const GetRandomTemplatesData = await axios.post(url, {
          page: 1,
          size: 28,
          filters: { type: 1 }
      }, {
          headers: {
              'token': token,
              'Content-Type': 'application/json'
          }
      }).then(res=>res.data);
      console.log("GetRandomTemplatesData", GetRandomTemplatesData)
      if(GetRandomTemplatesData && GetRandomTemplatesData.data && GetRandomTemplatesData.data.length > 0) {
        setPptxRandomTemplates(GetRandomTemplatesData.data)
        setPptxRandomTemplates6(GetRandomTemplatesData.data.splice(0, 6))
      }
    }
    catch(Error: any) {
      console.log("handleGetRandomTemplates Error", Error)
    }
  }

  const handleGenerateOutline = async () => {
    try {
      handleGetRandomTemplates()

      setIsDisabled(true)
      setStep(0)
      if(pptxOutline == '') {
        setPptxOutlineError('PPTX Outline must input')

        return
      }
      if(pptxOutline.length < 3) {
        setPptxOutlineError('PPTX Outline subject is too short')

        return
      }
      setPptxOutlineError('')

      const url = 'https://docmee.cn/api/ppt/generateOutline'
      let outline = ''
      const source: any = new window.SSE(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'token': token
        },
        payload: JSON.stringify({ subject: pptxOutline }),
      })
      console.log("source", source)
      source.onmessage = function (data: any) {
          try {
            const json = JSON.parse(data.data)
            outline += json.text
            setPptxOutlineResult(outline)
            window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
          }
          catch(e: any) {
            console.log("handleGenerateOutline Error", e)
          }
      }
      source.onend = function (data: any) {
          console.log("onend", data.data)
          console.log("pptxOutlineResult", pptxOutlineResult)
      }
      source.onerror = function (err: any) {
          console.error('生成大纲异常', err)
      }
      source.stream()
    }
    catch(Error: any) {
      console.log("handleGenerateOutline Error", Error)
    }

  }
  
  const handleGeneratePPTX = async (templateId: string) => {
    try {
      console.log("templateId", templateId)
      setStep(1)
      setIsDisabled(true)
      setIsDisabledText(t('Gegerating...') as string)
      const url = 'https://docmee.cn/api/ppt/generateContent'
      const source: any = new window.SSE(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'token': token
          },
          payload: JSON.stringify({ outlineMarkdown: pptxOutlineResult, asyncGenPptx: true, templateId }),
      })
      source.onmessage = function (data: any) {
        try{
          const json = JSON.parse(data.data)
          if (json.pptId) {
              console.log(`正在生成中，进度 ${json.current}/${json.total}，请稍后...`)
              asyncGenPptxInfo(json.pptId, json.current)
          }
        }
        catch(e: any) {
          console.log("handleGeneratePPTX Error", e)
        }
          
      }
      source.onend = function (data: any) {
          console.log('handleGeneratePPTX onend', data)
          setIsDisabled(false)
          setIsDisabledText(t('Download PPTX') as string)
      }
      source.onerror = function (err: any) {
          console.error('生成内容异常', err)
          alert('生成内容异常')
      }
      source.stream()
    }
    catch(Error: any) {
      console.log("handleGeneratePPTX Error", Error)
    }
  }

  const asyncGenPptxInfo = (id: string, pageId: number) => {
    try {
      const pptxId = id
      const url = `https://docmee.cn/api/public/ppt/asyncPptInfo?apiKey=${apiKey}&pptId=${pptxId}`
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const resp = JSON.parse(xhr.responseText)
              const gzipBase64 = resp.data.pptxProperty
              const gzip = base64js.toByteArray(gzipBase64)
              const json = pako.ungzip(gzip, { to: 'string' })
              const pptxObjTemp = JSON.parse(json)
              setPptxObj(pptxObjTemp)
              setPages(pageId)
              console.log("asyncGenPptxInfo pptxObj", pptxObjTemp)
            }
            catch(e: any) {
              console.log("asyncGenPptxInfo Error", e)
            }
          }
        }
      }
      xhr.onerror = function (e) {
          console.error("asyncGenPptxInfo:", e)
      }
    }
    catch(Error: any) {
      console.log("asyncGenPptxInfo Error", Error)
    }
  }

  const handleSetPptxPage = (pageId: number) => {
    const painter = new window.Ppt2Svg("right_canvas",undefined, undefined, pptxObj);
    painter.drawPptx(pptxObj, pageId)
    painter.svgNode();
    painter.setMode("edit");
  }

  const handleDownloadJson = () => {
    setIsDisabled(true)
    downloadJson(pptxObj, pptxOutline + "000")
    setIsDisabled(false)
  }

  const handleDownloadPPTX = async () => {
    try {
      setIsDisabled(true)
      setIsDisabledText(t('Downloading...') as string)
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.open('POST', 'https://docmee.cn/api/public/ppt/json2ppt?apiKey=' + apiKey)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.onload = function() {
          if (this.status == 200) {
              const blob = this.response
              const a = document.createElement('a')
              a.href = window.URL.createObjectURL(blob)
              const name = 'download'
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
    catch(Error: any) {
      console.log("handleDownloadPPTX Error", Error)
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ mt: 3, ml: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
              size="small"
              label={`${t('Subject')}`}
              placeholder={pptxOutlineError}
              value={pptxOutline}
              onChange={(e) => setPptxOutline(e.target.value)}
              error={!!pptxOutlineError}
          />
          <Button size="small" variant='contained' style={{ marginLeft: '10px' }} onClick={() => handleGenerateOutline()}>
              {t("Generate")}
          </Button>
          <FormHelperText style={{ color: 'error.main', marginLeft: '10px' }}>{pptxOutlineError}</FormHelperText>
          <Button variant='outlined' size="small" disabled={isDisabled} style={{ marginLeft: '10px' }} onClick={() => handleDownloadJson()}>
              Download Json
          </Button>
          <Button variant='contained' size="small" disabled={isDisabled} style={{ marginLeft: '10px' }} onClick={() => handleDownloadPPTX()}>
              {isDisabledText}
          </Button>
        </div>
      </Grid>

      {step == 0 && (
        <Fragment>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <Box sx={{ 
                    m: 3,
                    p: 3,
                    borderRadius: 1,
                    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
                    top: '55px', 
                    overflowX: 'hidden', 
                    position: 'absolute',
                    height: 'calc(100% - 5rem)',
                    width: '40%'
                    }}>
              <ReactMarkdown>{pptxOutlineResult.replaceAll('```', '')}</ReactMarkdown>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {pptxRandomTemplates && pptxRandomTemplates.length > 0 && pptxRandomTemplates.map((item, index) => (
                <Grid item xs={10} sm={6} md={6} lg={6} key={index}>
                  <Box position="relative" sx={{ mb: 2, mr: 2 }}>
                    <CardMedia image={`${item.coverUrl + '?token=' + token}`} onClick={()=>handleGeneratePPTX(item.id)} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Fragment>
      )}
      {step == 1 && (
        <Fragment>
          <Grid item xs={2} sx={{ mt: 6 }}>
            <Box sx={{ p: 0, position: 'absolute', top: '60px', overflowX: 'hidden', height: 'calc(100% - 4rem)'}}>
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
          <Grid item xs={9} sx={{ mt: 6 }}>
            <Box sx={{ p: 0, position: 'absolute', top: '60px', overflowX: 'hidden', height: 'calc(100% - 4rem)'}}>
              <svg id="right_canvas"></svg>
              <Grid container spacing={2}>
                {pptxRandomTemplates6 && pptxRandomTemplates6.length > 0 && (
                  <Grid item xs={12} sx={{my: 3}}>
                    Using other templates:
                  </Grid>
                )}
                
                {pptxRandomTemplates6 && pptxRandomTemplates6.length > 0 && pptxRandomTemplates6.map((item, index) => (
                  <Grid item xs={10} sm={4} md={4} lg={4} key={index}>
                    <Box position="relative" sx={{ mb: 2, mr: 2 }}>
                      <CardMedia image={`${item.coverUrl + '?token=' + token}`} onClick={()=>handleGeneratePPTX(item.id)} sx={{ height: '6.25rem', objectFit: 'contain', borderRadius: 1 }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Fragment>

      )}
    </Grid>
  )
}

export default PPTXModel

