import React, { useEffect, useRef, forwardRef } from 'react'

let MindElixir;
import('mind-elixir').then((module) => { MindElixir = module.default; }).catch((error) => { console.error('Failed to import MindElixir:', error.message); MindElixir = null; });

let NodeMenu;
import('@mind-elixir/node-menu').then((module) => { NodeMenu = module.default; }).catch((error) => { console.error('Failed to import MindElixir node-menu:', error.message); NodeMenu = null; });

function MindElixirReact(
  { style, data, options, plugins, onOperate, onSelectNode, onExpandNode },
  ref
) {
  const isFirstRun = useRef(true)
 
  useEffect(() => {
    if(MindElixir != null && NodeMenu != null)     {
      isFirstRun.current = true
      const instance = new MindElixir({
        el: ref.current,
        ...options,
      })
      for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i]
        instance.install(plugin)
      }
      instance.bus.addListener('operation', (operation) => {
        onOperate(operation)
      })
      instance.bus.addListener('selectNode', (operation) => {
        onSelectNode(operation)
      })
      instance.bus.addListener('expandNode', (operation) => {
        onExpandNode(operation)
      })
      instance.install(NodeMenu);
      ref.current.instance = instance
      console.log('NodeMenu NodeMenu', NodeMenu)
    }
  }, [ref, options, plugins, onOperate, onSelectNode, onExpandNode, MindElixir, NodeMenu])

  useEffect(() => {
    if(data != null)  {
      if (isFirstRun.current) {
        if (!ref.current.instance) return
        ref.current.instance.init(data)
        isFirstRun.current = false
        console.log('init', ref.current.instance)
      } else {
        ref.current.instance.refresh(data)
        console.log('refresh', ref.current.instance)
      }
    }
  }, [ref, options, data])
  console.log('render')
  
  return <div ref={ref} style={style}></div>
}

export default forwardRef(MindElixirReact)