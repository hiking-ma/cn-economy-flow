/** 工具提示配置：节点卡片 / 资金流明细。 */

import { NODES, CATEGORY_META, nameById } from '../../data/nodes'
import { fmtWanYi } from '../../data/flows'

interface TooltipParams {
  dataType: string
  data: {
    id?: string
    name: string
    value?: number
    flowLabel?: string
    flowNote?: string
    directive?: boolean
    source?: string
    target?: string
  }
}

export function buildTooltip() {
  return {
    trigger: 'item' as const,
    confine: true,
    // 锚定在离鼠标最远的对角，避免遮挡当前节点的连线和箭头
    position: (
      point: number[],
      _params: unknown,
      _dom: unknown,
      _rect: unknown,
      size: { contentSize: number[]; viewSize: number[] },
    ) => {
      const [cw, ch] = size.contentSize
      const [vw, vh] = size.viewSize
      const pad = 16
      return [point[0] < vw / 2 ? vw - cw - pad : pad, point[1] < vh / 2 ? vh - ch - pad : pad]
    },
    backgroundColor: 'rgba(15,18,26,0.94)',
    borderColor: '#2a3245',
    textStyle: { color: '#d7dce6', fontSize: 12 },
    formatter: (p: unknown) => {
      const d = p as TooltipParams
      if (d.dataType === 'node') {
        const n = NODES.find((x) => x.id === d.data.id || x.name === d.data.name)
        const cat = CATEGORY_META[n?.category ?? 'entity']
        const stats = n?.stats
          .map((s) => `${s.label}: <b style="color:#fff">${s.value}</b>`)
          .join('<br/>')
        return (
          `<div style="max-width:300px">` +
          `<div style="font-weight:700;color:#fff;font-size:13px">${d.data.name}</div>` +
          `<div style="color:${cat.color};margin:2px 0">${cat.label}</div>` +
          `<div style="color:#9aa4b5">${n?.tagline ?? ''}</div>` +
          (stats ? `<div style="margin-top:6px">${stats}</div>` : '') +
          `<div style="color:#5c6575;margin-top:6px;font-size:11px">点击聚焦相关资金流 · 再次点击取消</div>` +
          `</div>`
        )
      }
      const amountLine = d.data.directive
        ? `<div style="color:#8a94a6;margin:4px 0;font-size:12px">政策指令（非资金流）</div>`
        : `<div style="color:#e0b34e;margin:4px 0;font-size:14px">${fmtWanYi(d.data.value ?? 0)}/年</div>`
      return (
        `<div style="max-width:320px">` +
        `<div style="font-weight:700;color:#fff;font-size:13px">${d.data.flowLabel ?? ''}</div>` +
        amountLine +
        `<div style="color:#9aa4b5">${nameById(d.data.source ?? '')} → ${nameById(d.data.target ?? '')}</div>` +
        `<div style="color:#9aa4b5;margin-top:4px;font-size:12px">${d.data.flowNote ?? ''}</div>` +
        `</div>`
      )
    },
  }
}
