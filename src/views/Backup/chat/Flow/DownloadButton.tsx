import React from 'react';
import { Panel, useReactFlow, getNodesBounds, getViewportForBounds } from 'reactflow';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 2048;
const imageHeight = 4096;

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

    // @ts-ignore
    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform['x']}px, ${transform['y']}px) scale(${transform['zoom']})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button style={{
            border: '1px solid #eee',
            padding: '2px 4px',
            borderRadius: '5px',
            fontWeight: 700,
            cursor: 'pointer'
        }}
        onClick={onClick}>
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;
