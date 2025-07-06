import ForceGraph2D from 'react-force-graph-2d';
import React from 'react';

export const RouteSelectionView = () => {
  const graphData = genRandomTree(50);
  console.log({ graphData });
  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel='id'
      nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
      nodePointerAreaPaint={nodePaint}
      backgroundColor='#EEEEEE'
      enablePanInteraction={true}
      enableZoomInteraction={true}
      enableNodeDrag={false}
      enablePointerInteraction={false}
    />
  );
};

export function genRandomTree(N: number = 300, reverse: boolean = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
      })),
  };
}

function nodePaint(
  { id, x, y }: { id: number; x: number; y: number },
  color: string,
  ctx: CanvasRenderingContext2D,
) {
  ctx.fillStyle = color;
  [
    () => {
      ctx.fillRect(x - 6, y - 4, 12, 8);
    }, // rectangle
    () => {
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.fill();
    }, // triangle
    () => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      ctx.fill();
    }, // circle
    () => {
      ctx.font = '10px Sans-Serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Text', x, y);
    }, // text
  ][id % 4]();
}

// gen a number persistent color from around the palette
const getColor = (n: number) =>
  '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');
