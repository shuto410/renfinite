import ForceGraph2D from 'react-force-graph-2d';
import React from 'react';
import { link } from 'fs';

export const RouteSelectionView = () => {
  const graphData = genRandomTree(50);
  // const graphData2 = genPathsGraphData(14, 4, false);
  console.log({ graphData });
  // console.log({ graphData2 });
  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel='id'
      nodeCanvasObject={(node, ctx) => nodePaint(node, getColor(node.id), ctx)}
      nodePointerAreaPaint={nodePaint}
      // width={500}
      // height={700}
      backgroundColor='#EEEEEE'
      enablePanInteraction={true}
      enableZoomInteraction={true}
      enableNodeDrag={false}
      enablePointerInteraction={false}
    />
  );
};

// export function genPathsGraphData(
//   depth: number = 14,
//   maxLanes: number = 3,
//   reverse: boolean = false,
// ) {
//   const phaseDepth = 3;
//   const phase1Nodes = [...Array(phaseDepth).keys()].map((d) => {
//     const lanes = [...Array(maxLanes).keys()].map((l) => {
//       return {
//         id: d * maxLanes + l,
//         x: l * 7,
//         y: d * 90,
//       };
//     });
//     return lanes;
//   });
//   const phase1EventNode = {
//     id: phaseDepth * maxLanes + maxLanes,
//     x: 2 * 7,
//     y: phaseDepth * 90,
//   };
//   const phase2Nodes = [...Array(phaseDepth).keys()].map((d) => {
//     const lanes = [...Array(maxLanes).keys()].map((l) => {
//       return {
//         id: d * maxLanes + l + phaseDepth * maxLanes,
//         x: l * 7,
//         y: d * 90 + 90 * phaseDepth,
//       };
//     });
//     return lanes;
//   });

//   const nodes = [...phase1Nodes, phase1EventNode, ...phase2Nodes];
//   return {
//     nodes,
//     links: [],
//   };
//   // const nodesList = [...Array(depth).keys()].map((d) => {
//   //   const laneSize = Math.floor(Math.random() * (maxLanes - 2)) + 2;
//   //   const lanes = [...Array(laneSize).keys()].map((l) => {
//   //     return {
//   //       id: d * maxLanes + l,
//   //       x: l * 7,
//   //       y: d * 90,
//   //     };
//   //   });
//   //   return lanes;
//   // });
//   // const nodes = nodesList.flat();
//   // const goalNodeIndex = depth * maxLanes + 10;
//   // nodes.push({
//   //   id: goalNodeIndex,
//   //   x: 20,
//   //   y: depth * 15,
//   // });
//   // const links = nodesList.flatMap((nodes, d) => {
//   //   return nodes.map((node) => {
//   //     if (d === depth - 1) {
//   //       return {
//   //         [reverse ? 'target' : 'source']: node.id,
//   //         [reverse ? 'source' : 'target']: goalNodeIndex,
//   //       };
//   //     }
//   //     const targetIndex = Math.floor(Math.random() * nodesList[d + 1].length);
//   //     const targetNode = nodesList[d + 1][targetIndex];
//   //     if (!targetNode) {
//   //       console.log('no target node');
//   //       console.log({ nodesList, d, targetIndex });
//   //     }
//   //     return {
//   //       [reverse ? 'target' : 'source']: node.id,
//   //       [reverse ? 'source' : 'target']: targetNode.id,
//   //     };
//   //   });
//   // });

//   // return {
//   //   nodes,
//   //   links: [],
//   // };
// }

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
