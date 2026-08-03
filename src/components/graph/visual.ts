/** 视觉映射：连线粗细/不透明度随金额变化，以及点击聚焦模式的置灰配色。 */

import { MAX_AMOUNT } from '../../data/flows'

export const edgeWidth = (amount: number) => 1.2 + Math.sqrt(amount / MAX_AMOUNT) * 6.8

export const edgeOpacity = (amount: number) => {
  if (amount >= 100000) return 0.72
  if (amount >= 30000) return 0.5
  if (amount >= 10000) return 0.4
  return 0.3
}

/** 聚焦模式下相关连线的最低不透明度（小流量边平时太暗，聚焦时提亮） */
export const RELATED_EDGE_OPACITY = 0.85
/** 聚焦模式下置灰连线的不透明度 */
export const DIM_EDGE_OPACITY = 0.12

/** 置灰配色（节点填充 / 节点标签文字 / 连线） */
export const DIM_NODE_COLOR = '#2f3748'
export const DIM_LABEL_COLOR = '#66718a'
export const DIM_EDGE_COLOR = '#3a4356'

/** 选中节点描边 */
export const FOCUS_BORDER_COLOR = '#ffffff'
