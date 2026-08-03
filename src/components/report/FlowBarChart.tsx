/** 横向条形图：部门资金流入/流出金额对比。自包含注册 BarChart + GridComponent。 */

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { fmtWanYi } from '../../data/flows'

// echarts.use 是全局注册表：此处必须补注册 GridComponent，否则条形图空白且不报错
echarts.use([BarChart, GridComponent, CanvasRenderer])

export interface BarItem {
  label: string
  value: number
  dir: 'in' | 'out'
  /** 余额口径（年末存量），标签追加「（年末存量）」 */
  stock?: boolean
}

interface Props {
  items: BarItem[]
  /** 跨图共享的刻度上限（同一卡片内流入/流出图用同一最大值，保证柱长按全卡最大金额等比） */
  maxValue?: number
}

export default function FlowBarChart({ items, maxValue }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const height = 20 + items.length * 32

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chart = echarts.init(el)
    const max = maxValue ?? Math.max(...items.map((i) => i.value))
    chart.setOption({
      animation: false,
      grid: { left: 8, right: 96, top: 4, bottom: 4, containLabel: true },
      xAxis: { type: 'value', show: false, max: max * 1.2 },
      yAxis: {
        type: 'category',
        inverse: true,
        data: items.map((i) => i.label),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9aa4b5', fontSize: 11 },
      },
      series: [
        {
          type: 'bar',
          barWidth: 14,
          data: items.map((i) => ({
            value: i.value,
            itemStyle: {
              color: i.dir === 'in' ? '#5aa7e0' : '#e05a4e',
              borderRadius: [0, 3, 3, 0],
            },
          })),
          label: {
            show: true,
            position: 'right',
            color: '#f2c35c',
            fontSize: 11,
            formatter: (p: { value: number; dataIndex: number }) =>
              `${fmtWanYi(p.value)}${items[p.dataIndex].stock ? '（年末存量）' : ''}`,
          },
        },
      ],
    })

    let timer: number | undefined
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = window.setTimeout(() => chart.resize(), 120)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      clearTimeout(timer)
      chart.dispose()
    }
  }, [items, maxValue])

  return <div ref={ref} style={{ height }} />
}
