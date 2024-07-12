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

import 'src/functions/ppt2svg.js';
import 'src/functions/ppt2canvas.js';

const apiKey = '9664f0ea9a4cee65c'

var pptxId = ''
var outline = ''
var templateId = ''
var pptxObj: any = null
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
            asyncGenPptxInfo(json.pptId)
        }
    }
    source.onend = function (data: any) {
        clearInterval(timer)
        //document.getElementById('desc').style.display = 'none'
        //document.getElementById('pptDownload').style.display = 'inline-block'
        drawPptxList()
    }
    source.onerror = function (err: any) {
        clearInterval(timer)
        console.error('生成内容异常', err)
        alert('生成内容异常')
    }
    source.stream()
  }
  function asyncGenPptxInfo(id: string) {
      const pptxId = id
      let url = `https://docmee.cn/api/public/ppt/asyncPptInfo?apiKey=${apiKey}&pptId=${pptxId}`
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.send()
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  let resp = JSON.parse(xhr.responseText)
                  let gzipBase64 = resp.data.pptxProperty
        let gzip = base64js.toByteArray(gzipBase64)
        let json = pako.ungzip(gzip, { to: 'string' })
                  pptxObj = JSON.parse(json)
                  drawPptxList(resp.data.current - 1, true)
              }
          }
      }
      xhr.onerror = function (e) {
          console.error(e)
          //document.getElementById('desc').style.display = 'none'
      }
  }
  async function drawPptxList(idx: number, asyncGen: boolean) {
      if (idx == null || document.getElementById('img_' + idx) == null) {
          let html = ''
          for (let i = 0; i < pptxObj.pages.length; i++) {
              if (asyncGen && i > idx) {
                  break
              }
              html += '<div class="left_div_item" onclick="drawPptx(' + i + ')">'
              html += '<div class="left_div_item_index">' + (i + 1) + '</div>'
              html += '<canvas id="img_' + i + '" width="288" height="162" style="width: 144px;height: 81px;" class="left_div_item_img" />'
              html += '</div>'
          }
          //document.getElementById('left_image_list').innerHTML = html
          for (let i = 0; i < pptxObj.pages.length; i++) {
              let imgCanvas: any = document.getElementById('img_' + i)
              if (!imgCanvas) {
                  continue
              }
              try {
                  let _ppt2Canvas: any = new Ppt2Canvas(imgCanvas, 'anonymous')
                  await _ppt2Canvas.drawPptx(pptxObj, i)
              } catch(e) {
                  console.log('渲染第' + (i + 1) + '页封面异常', e)
              }
          }
      } else if (idx != null) {
          try {
              let imgCanvas: any = document.getElementById('img_' + i) = document.getElementById('img_' + idx)
              let _ppt2Canvas: any = new Ppt2Canvas(imgCanvas, 'anonymous')
              await _ppt2Canvas.drawPptx(pptxObj, idx)
          } catch(e) {
              console.log('渲染第' + (idx + 1) + '页封面异常', e)
          }
      }

      drawPptx(idx || 0)
  }
  function drawPptx(idx: any) {
      let lastSelect = document.getElementById('img_' + selectIdx)
      lastSelect && lastSelect.classList.remove('item_select')
      //document.getElementById('right_canvas').style.display = 'block'
      selectIdx = idx
      let current: any = document.getElementById('img_' + idx)
      current.classList.add('item_select')
      painter.drawPptx(pptxObj, idx)
  }
  function downloadPptx() {
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
      }
      xhr.onerror = function (e) {
          console.error(e)
      }
      xhr.send(JSON.stringify(pptxObj))
  }

  console.log("pptxOutlineResult", pptxOutlineResult)

  //, textAlign: 'center'

  return (
    <Grid container spacing={3}>
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
    </Grid>
  )
}

export default PPTXModel

