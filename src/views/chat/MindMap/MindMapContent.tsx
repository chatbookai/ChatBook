import MindElixirReact from './MindElixirReact'
import Grid from '@mui/material/Grid'
import React, { useRef, useState, useEffect, Fragment } from 'react'

const Flow = (props: any) => {
    // ** Props
    const { data, ME } = props

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [plugins, setPlugins] = useState<any[]>([])
    const [options, setOptions] = useState<any>(null)
    
    const handleOperate = (operation: any) => {
      console.log('handleOperate', operation)
    }
    const handleSelectNode = (operation: any) => {
      console.log('handleSelectNode', operation)
    }
    const handleExpandNode = (operation: any) => {
      console.log('handleExpandNode', operation)
    }

    useEffect(() => {
      setIsLoaded(true)
    }, [])

    useEffect(() => {
      if(isLoaded) {
        const options = {
          direction: 2,
          draggable: true, // default true
          contextMenu: true, // default true
          toolBar: true, // default true
          nodeMenu: true, // default true
          keypress: true, // default true
          locale: 'zh_CN', // [zh_CN,zh_TW,en,ja,pt,ru] waiting for PRs
          overflowHidden: false, // default false
          mainLinkStyle: 2, // [1,2] default 1
          mouseSelectionButton: 0, // 0 for left button, 2 for right button, default 0
          contextMenuOption: {
            focus: true,
            link: true,
            extend: [
              {
                name: 'Node edit',
                onclick: () => {
                  alert('extend menu')
                },
              },
            ],
          },
        }
        setOptions(options)
        setPlugins([])
      }
    }, [isLoaded])

  return (
    <Fragment>
      {data && isLoaded ?
        <Fragment>
            <MindElixirReact
              ref={ME}
              data={data}
              options={options}
              plugins={plugins}
              style={{ height: '100%', width: '70%' }}
              onOperate={handleOperate}
              onSelectNode={handleSelectNode}
              onExpandNode={handleExpandNode}
            />
        </Fragment>
      :
      <Grid container spacing={6} style={{ height: '100%', width: '70%' }}>
      </Grid>
      }
    </Fragment>
  )
}

export default Flow;
