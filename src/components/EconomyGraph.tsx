import { useCallback, useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { GraphChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { buildOption, type GraphHighlight } from './graph/option'

echarts.use([GraphChart, TooltipComponent, CanvasRenderer])

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function EconomyGraph({ selectedId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<echarts.ECharts | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const hoverRef = useRef<GraphHighlight>({ nodeId: null, edgeIdx: null })
  const selectedRef = useRef<string | null>(selectedId)

  const renderChart = useCallback(() => {
    const el = ref.current
    const chart = chartRef.current
    if (!el || !chart) return
    const { clientWidth: w, clientHeight: h } = el
    if (w > 0 && h > 0) chart.setOption(buildOption(w, h, hoverRef.current, selectedRef.current))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chart = echarts.init(el)
    chartRef.current = chart
    renderChart()

    let timer: number | undefined
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        chart.resize()
        renderChart()
      }, 120)
    })
    ro.observe(el)

    const setHover = (next: GraphHighlight) => {
      const prev = hoverRef.current
      if (prev.nodeId === next.nodeId && prev.edgeIdx === next.edgeIdx) return
      hoverRef.current = next
      renderChart()
    }
    chart.on('mouseover', (params) => {
      if (params.dataType === 'node') {
        setHover({ nodeId: (params.data as { id?: string }).id ?? null, edgeIdx: null })
      } else if (params.dataType === 'edge') {
        setHover({ nodeId: null, edgeIdx: params.dataIndex ?? null })
      }
    })
    chart.on('mouseout', () => setHover({ nodeId: null, edgeIdx: null }))

    chart.on('click', (params) => {
      if (params.dataType === 'node') {
        const id = (params.data as { id?: string }).id
        // 再次点击同一节点 = 取消聚焦
        if (id) onSelectRef.current(selectedRef.current === id ? null : id)
      } else {
        onSelectRef.current(null)
      }
    })

    // 点击空白处取消聚焦（带位移守卫，避免拖拽平移后误触发）
    const zr = chart.getZr()
    let downX = 0
    let downY = 0
    zr.on('mousedown', (e) => {
      downX = e.offsetX
      downY = e.offsetY
    })
    zr.on('click', (e) => {
      if (!e.target && Math.hypot(e.offsetX - downX, e.offsetY - downY) < 6) onSelectRef.current(null)
    })
    // 指针离开画布时兜底清空悬停态：setOption/resize 重建后 zrender 内部 hover 跟踪可能被重置，
    // 导致 chart.on('mouseout') 不触发、hoverRef 残留而使连线标签卡住不消失。globalout 不受该问题影响。
    zr.on('globalout', () => setHover({ nodeId: null, edgeIdx: null }))

    return () => {
      ro.disconnect()
      clearTimeout(timer)
      chart.dispose()
      chartRef.current = null
    }
  }, [renderChart])

  useEffect(() => {
    if (selectedRef.current === selectedId) return
    selectedRef.current = selectedId
    renderChart()
  }, [selectedId, renderChart])

  return <div ref={ref} className="graph-canvas" />
}
