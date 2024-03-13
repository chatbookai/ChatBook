import MindElixirReact from 'mind-elixir-react'
import exportXmind from '@mind-elixir/export-xmind'
import Grid from '@mui/material/Grid'
import React, { useRef, useState, useEffect, Fragment } from 'react'

const Flow = (props: any) => {
  // ** Props
  const {
    data
  } = props

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [plugins, setPlugins] = useState<any[]>([])
    const [options, setOptions] = useState<any>(null)
    
    const ME: any = useRef(null)
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
        setPlugins([exportXmind])
        setOptions({})
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
