/** 组装 ECharts option：节点/连线样式、悬停标签显隐、点击聚焦置灰。 */

import type { EChartsCoreOption } from 'echarts/core'
import { NODES, CATEGORY_META } from '../../data/nodes'
import { FLOWS, DIRECTIVES, flowColor, fmtWanYi } from '../../data/flows'
import { LAYOUT, PAD, EDGE_CURVENESS, DEFAULT_CURVENESS } from './layout'
import {
  edgeWidth,
  edgeOpacity,
  RELATED_EDGE_OPACITY,
  DIM_EDGE_OPACITY,
  DIM_NODE_COLOR,
  DIM_LABEL_COLOR,
  DIM_EDGE_COLOR,
  FOCUS_BORDER_COLOR,
} from './visual'
import { buildTooltip } from './tooltip'

/** 悬停高亮状态：ECharts 的 emphasis 不会提升边的 label.show，
 *  连线标签的显隐由组件在 mouseover/mouseout 时自行管理。 */
export interface GraphHighlight {
  nodeId?: string | null
  edgeIdx?: number | null
}

export function buildOption(
  width: number,
  height: number,
  highlight: GraphHighlight,
  selectedId: string | null,
): EChartsCoreOption {
  const px = (fx: number) => PAD.x + fx * (width - PAD.x * 2)
  const py = (fy: number) => PAD.top + fy * (height - PAD.top - PAD.bottom)

  // 聚焦模式：点击节点后只保留"该节点 + 相关连线 + 相邻节点"，其余置灰。
  // 不用 ECharts emphasis/blur：setOption 重渲染会清掉 dispatchAction 的高亮态，且置灰程度不可控。
  const focused = selectedId != null
  const relatedNodes = new Set<string>()
  const relatedEdges = new Set<number>()
  if (selectedId) {
    relatedNodes.add(selectedId)
    const mark = (idx: number, source: string, target: string) => {
      if (source !== selectedId && target !== selectedId) return
      relatedEdges.add(idx)
      relatedNodes.add(source)
      relatedNodes.add(target)
    }
    FLOWS.forEach((f, i) => mark(i, f.source, f.target))
    DIRECTIVES.forEach((d, j) => mark(FLOWS.length + j, d.source, d.target))
  }

  const edgeLabelVisible = (idx: number, source: string, target: string) => {
    if (highlight.edgeIdx != null && idx === highlight.edgeIdx) return true
    if (highlight.nodeId && (source === highlight.nodeId || target === highlight.nodeId)) return true
    // 聚焦时直接展示相关连线的文字与金额（未聚焦时 relatedEdges 为空）
    return relatedEdges.has(idx)
  }

  const nodes = NODES.map((n) => {
    const [fx, fy] = LAYOUT[n.id] ?? [0.5, 0.5]
    const isFocus = n.id === selectedId
    const isDim = focused && !relatedNodes.has(n.id)
    return {
      id: n.id,
      name: n.name,
      x: px(fx),
      y: py(fy),
      symbolSize: n.size / 3 + 14,
      itemStyle: {
        color: isDim ? DIM_NODE_COLOR : CATEGORY_META[n.category].color,
        borderColor: isFocus ? FOCUS_BORDER_COLOR : '#0b0e14',
        borderWidth: isFocus ? 2.5 : 2,
        shadowBlur: isDim ? 0 : 14,
        shadowColor: 'rgba(0,0,0,0.45)',
      },
      label: {
        show: true,
        position: 'bottom',
        distance: 6,
        formatter: `{title|${n.name}}`,
        rich: {
          title: {
            fontSize: 11,
            fontWeight: 600,
            color: isDim ? DIM_LABEL_COLOR : '#e6e9f0',
            padding: [3, 7, 2, 7],
            backgroundColor: 'rgba(13,17,24,0.78)',
            borderRadius: 4,
            align: 'center',
          },
        },
      },
      emphasis: {
        focus: 'adjacency',
        itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
      },
    }
  })

  const flowLinks = FLOWS.map((f, i) => {
    const w = edgeWidth(f.amount)
    const isRelated = relatedEdges.has(i)
    const isDim = focused && !isRelated
    return {
      source: f.source,
      target: f.target,
      value: f.amount,
      flowLabel: f.label,
      flowNote: f.note,
      symbolSize: [0, Math.max(6, w * 1.6)],
      lineStyle: {
        color: isDim ? DIM_EDGE_COLOR : flowColor(f.amount),
        width: w,
        opacity: isDim ? DIM_EDGE_OPACITY : isRelated ? Math.max(edgeOpacity(f.amount), RELATED_EDGE_OPACITY) : edgeOpacity(f.amount),
        curveness: f.curve ?? EDGE_CURVENESS[`${f.source}->${f.target}`] ?? DEFAULT_CURVENESS,
      },
      label: {
        show: edgeLabelVisible(i, f.source, f.target),
        formatter: `{t|${f.label}}\n{v|${fmtWanYi(f.amount)}（2025）}`,
        // 不透明度需显式为 1：否则 setLabelStyle 会回退到 defaultOpacity（= 边的 lineStyle.opacity，最暗 0.3）
        opacity: 1,
        rich: {
          t: { fontSize: 10, color: '#aab3c5', align: 'center' },
          v: { fontSize: 10, fontWeight: 700, color: '#f2c35c', align: 'center', padding: [2, 0, 0, 0] },
        },
        backgroundColor: 'rgba(11,14,20,0.72)',
        borderRadius: 4,
        padding: [3, 6],
      },
    }
  })

  const directiveLinks = DIRECTIVES.map((d, j) => {
    const isRelated = relatedEdges.has(FLOWS.length + j)
    const isDim = focused && !isRelated
    return {
      source: d.source,
      target: d.target,
      flowLabel: d.label,
      flowNote: d.note,
      directive: true,
      symbolSize: [0, 6],
      lineStyle: {
        color: isDim ? DIM_EDGE_COLOR : isRelated && focused ? '#93a0b5' : '#5c6575',
        width: 1.2,
        opacity: isDim ? DIM_EDGE_OPACITY : isRelated && focused ? RELATED_EDGE_OPACITY : 0.55,
        type: 'dashed' as const,
        curveness: 0.15,
      },
      label: {
        show: edgeLabelVisible(FLOWS.length + j, d.source, d.target),
        formatter: `{t|${d.label}}`,
        opacity: 1,
        rich: { t: { fontSize: 10, color: '#8a94a6', align: 'center' } },
        backgroundColor: 'rgba(11,14,20,0.72)',
        borderRadius: 4,
        padding: [3, 6],
      },
    }
  })

  return {
    tooltip: buildTooltip(),
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: true,
        zoom: 1,
        edgeSymbol: ['none', 'arrow'],
        data: nodes,
        links: [...flowLinks, ...directiveLinks],
        categories: Object.values(CATEGORY_META).map((v) => ({
          name: v.label,
          itemStyle: { color: v.color },
        })),
        // 不设置 series.edgeLabel.show：GraphSeries 会把它拷进 emphasis.edgeLabel.show，
        // 经 label→edgeLabel 路径映射后成为各边 emphasis.label.show 的回退值，
        // 导致 emphasis 状态携带 ignore:true，悬停时标签反而被隐藏。显隐统一由每条 link 的 label.show 控制。
        emphasis: {
          focus: 'adjacency',
          lineStyle: { opacity: 0.95 },
        },
        lineStyle: { opacity: 0.5 },
        animationDuration: 600,
      },
    ],
  }
}
