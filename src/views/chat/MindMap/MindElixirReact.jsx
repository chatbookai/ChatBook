import React, { useEffect, useRef, forwardRef, useState } from 'react'

function MindElixirReact(
  { style, data, options, plugins, onOperate, onSelectNode, onExpandNode },
  ref
) {
  const isFirstRun = useRef(true)
  const isLoaded = useRef(false)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      import("mind-elixir").then((MindElixirModule) => {
        const me = new MindElixirModule.default({
          el: ref.current,
          ...options,
        });
        for (let i = 0; i < plugins.length; i++) {
          const plugin = plugins[i];
          me.install(plugin);
        }
        me.bus.addListener("operation", (operation) => {
          onOperate(operation);
        });
        me.bus.addListener("selectNode", (operation) => {
          onSelectNode(operation);
        });
        me.bus.addListener("expandNode", (operation) => {
          onExpandNode(operation);
        });
        ref.current.instance = me;
        console.log("created", ref.current.instance);
        isLoaded.current = true;
      });
    }
  }, [ref, options, plugins, onOperate, onSelectNode, onExpandNode]);

  useEffect(() => {
    if(isLoaded.current) {
      if (isFirstRun.current) {
        if (!ref.current.instance) return
        ref.current.instance.init(data)
        isFirstRun.current = false
        console.log('init', ref.current.instance)
      } 
      else {
        ref.current.instance.refresh(data)
        console.log('refresh', ref.current.instance)
      }
    }
  }, [ref, options, data, isLoaded.current])
  console.log('render')
  
  return <div ref={ref} style={style}></div>
}

export default forwardRef(MindElixirReact)
