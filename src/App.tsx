import { useState } from 'react'
import EconomyGraph from './components/EconomyGraph'
import NodePanel from './components/NodePanel'
import Sidebar from './components/Sidebar'
import type { PageId } from './components/Sidebar'
import ReportPage from './components/report/ReportPage'
import { NODES, CATEGORY_META } from './data/nodes'
import { FLOWS } from './data/flows'
import './index.css'

export default function App() {
  const [page, setPage] = useState<PageId>('graph')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1 className="title">中国经济资金流动全景</h1>
          <span className="subtitle">财政 · 货币 · 金融 · 实体 —— 资金从哪来、到哪去</span>
        </div>
        <div className="header-right">
          <span className="snapshot">数据快照：2025 年度/年末公开统计为主（个别 2024 年末口径已单独标注）</span>
          <span className="legend-gap" />
          {Object.entries(CATEGORY_META).map(([k, v]) => (
            <span key={k} className="legend-item">
              <span className="dot" style={{ background: v.color }} />
              {v.label}
            </span>
          ))}
        </div>
      </header>

      <div className="app-body">
        <Sidebar page={page} onNavigate={setPage} />
        <main className="page-area">
          {page === 'graph' ? (
            <>
              <div className="graph-wrap">
                <EconomyGraph selectedId={selectedId} onSelect={setSelectedId} />
                <div className="hint">滚轮缩放 · 拖拽画布平移 · 悬停连线查看明细 · 点击节点查看资金流</div>
              </div>
              {selectedId && <NodePanel selectedId={selectedId} onClose={() => setSelectedId(null)} />}
            </>
          ) : (
            <ReportPage />
          )}
        </main>
      </div>

      <footer className="footer">
        {page === 'graph' ? (
          <>
            <span>
              连线越粗、颜色越热 = 年度资金量越大（≥10万亿 红 / ≥3万亿 橙 / ≥1万亿 黄 / &lt;1万亿 蓝）· 箭头为资金流向
            </span>
            <span>
              共 {NODES.length} 个主体 · {FLOWS.length} 条资金流 · 来源：财政部 / 人民银行 / 统计局
            </span>
          </>
        ) : (
          <>
            <span>金额单位：万亿元 · 蓝 = 流入 / 红 = 流出 · 标注「年末存量」者为余额口径</span>
            <span>来源：财政部 / 人民银行 / 统计局 / 社保基金理事会 / 中投公司年报</span>
          </>
        )}
      </footer>
    </div>
  )
}
