// ** React Imports
import { useState, useEffect, Fragment } from 'react'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'

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

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import { CheckPermission } from 'src/functions/ChatBook'
//import { Ppt2Canvas } from 'src/functions/ppt2canvas'
import { SSE } from 'src/functions/sse'
import base64js from 'base64-js'
import pako from 'pako'
import marked from 'marked'

import "./lib/base64js.js";
import "./lib/chart.js";
import "./lib/geometry.js";
import "./lib/marked.js";
import "./lib/pako.js";
import "./lib/ppt2canvas.js";
import "./lib/ppt2svg.js";
import "./lib/sse.js";
import { pptxObj, pageOne } from './data/pptx'


const apiKey = '9664f0ea9a4cee65c'

var pptxId = ''
var outline = ''
var templateId = ''
let selectIdx = 0
var mTimer: any = null


const PPTXModel = () => {
  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    CheckPermission(auth, router, false)
    handleGetRandomTemplates()
  }, [])
  
  const { id } = router.query
  const theme = useTheme()
  
  // ** State
  const [pptxOutline, setPptxOutline] = useState<string>('');
  const [pptxOutlineResult, setPptxOutlineResult] = useState<string>('');
  const [pptxOutlineError, setPptxOutlineError] = useState<string>('');
  const [pptxRandomTemplates, setPptxRandomTemplates] = useState<any[]>([]);

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
  
  useEffect(() => {
    console.log("pageOne", pageOne);
    let gzip = base64js.toByteArray(pageOne)
    let json = pako.ungzip(gzip, { to: 'string' })
    const pptxAllPageData = JSON.parse(json)
    console.log("pptxAllPageData", pptxAllPageData);

    const painter = new window.Ppt2Svg("right_canvas",undefined, undefined, pptxAllPageData);
    painter.drawPptx(pptxAllPageData, 21)

    //const canvas = painter.svgNode();
    painter.setMode("edit");

  }, []);

  console.log("pptxOutlineResult", pptxOutlineResult)

  //, textAlign: 'center'

  return (
    <Grid container spacing={3}>

      <Grid item xs={3} sx={{ mt: 3 }}>
        <div id="left_image_list"></div>
      </Grid>
      <Grid item xs={9} sx={{ mt: 3 }}>
        <svg id="right_canvas"></svg>
      </Grid>

      {false && (
        <Fragment>
          <Grid item xs={12} sx={{ mt: 3, ml: 3 }}>
            <TextField
              rows={10}
              size="small"
              label={`${t('PPTX Submit')}`}
              placeholder={pptxOutlineError}
              value={pptxOutline}
              onChange={(e) => setPptxOutline(e.target.value)}
              error={!!pptxOutlineError}
            />
            <Button size="small" variant='contained' sx={{ ml: 3 }} onClick={handleGeneratePPTXOutline}>
              {t("Generate PPTX outline")}
            </Button>
            <FormHelperText sx={{ color: 'error.main', ml: 3 }}>{pptxOutlineError}</FormHelperText>
          </Grid>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <Box sx={{ 
                    pl: 3,
                    borderRadius: 1,
                    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
                    }}>
              <ReactMarkdown>{pptxOutlineResult}</ReactMarkdown>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {pptxRandomTemplates && pptxRandomTemplates.length > 0 && pptxRandomTemplates.map((item, index) => (
                <Grid item xs={10} sm={6} md={6} lg={6} key={index}>
                  <Box position="relative" sx={{ mb: 2, mr: 2 }}>
                    <CardMedia image={`${item.coverUrl}`} onClick={()=>handleGeneratePPTX(item.id)} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1 }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Fragment>
      )}

    </Grid>
  )
}

export default PPTXModel

