import type { ModuleItemType, FlowModuleItemType } from 'src/functions/core/module/type.d';
import type { Edge, Node } from 'reactflow';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 6);

export const EDGE_TYPE = 'default';

export const appModule2FlowNode = (Module: any) => {
    return {...Module, type: Module.moduleId, id: nanoid()}
}

export const appModule2FlowEdge = (modules : ModuleItemType[] ) => {
    const edges: Edge[] = [];
    modules && modules.forEach((module) =>
      module.outputs.forEach((output) =>
        output.targets.forEach((target) => {
          edges.push({
            source: module.moduleId,
            target: target.moduleId,
            sourceHandle: output.key,
            targetHandle: target.key,
            id: nanoid(),
            type: EDGE_TYPE
          });
        })
      )
    );
  
    return edges;
  };