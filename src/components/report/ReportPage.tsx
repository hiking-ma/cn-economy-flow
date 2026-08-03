/** 部门解读报告页：平铺为单页可滚动，便于一次性截长图。无懒加载 / sticky / 分页。 */

import { Fragment } from 'react'
import { NODES, CATEGORY_META } from '../../data/nodes'
import { fmtWanYi } from '../../data/flows'
import type { FlowEdge } from '../../data/flows'
import {
  SUBJECT_REPORTS,
  REPORT_INTRO,
  PATIENT_CAPITAL,
  RESIDENT_PAIN,
  flowsInto,
  flowsOutOf,
} from '../../data/report'
import type { SubjectReport } from '../../data/report'
import FlowBarChart from './FlowBarChart'
import type { BarItem } from './FlowBarChart'

const toBars = (flows: FlowEdge[], dir: 'in' | 'out'): BarItem[] =>
  flows.map((f) => ({ label: f.label, value: f.amount, dir, stock: !!f.stock }))

const sum = (flows: FlowEdge[]) => flows.reduce((a, f) => a + f.amount, 0)

function FlowBlock({
  title,
  flows,
  dir,
  narrative,
  maxValue,
}: {
  title: string
  flows: FlowEdge[]
  dir: 'in' | 'out'
  narrative: string
  maxValue: number
}) {
  const total = sum(flows)
  return (
    <div className="flow-block">
      <div className="block-title">
        <span className={dir === 'in' ? 'dir-in' : 'dir-out'}>{title}</span>
        <span className={dir === 'in' ? 'block-total total-in' : 'block-total total-out'}>
          {fmtWanYi(total)}/年
        </span>
      </div>
      <p className="narrative">{narrative}</p>
      {flows.length > 0 && <FlowBarChart items={toBars(flows, dir)} maxValue={maxValue} />}
    </div>
  )
}

function SubjectCard({ report, patient }: { report: SubjectReport; patient?: boolean }) {
  const node = NODES.find((n) => n.id === report.nodeId)
  if (!node) return null
  const cat = CATEGORY_META[node.category]
  const inflows = flowsInto(node.id)
  const outflows = flowsOutOf(node.id)
  const cardMax = Math.max(...[...inflows, ...outflows].map((f) => f.amount))

  return (
    <section className={patient ? 'subject-card patient' : 'subject-card'}>
      <header className="card-header">
        <div>
          <span className="cat-chip" style={{ color: cat.color, borderColor: cat.color }}>
            {cat.label}
          </span>
          <div className="card-name">{node.name}</div>
          <div className="card-tagline">{node.tagline}</div>
        </div>
      </header>

      <div className="stat-grid">
        {node.stats.map((s) => (
          <div key={s.label} className="stat-box">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <p className="narrative intro-text">{report.intro}</p>

      <FlowBlock title="资金流入" flows={inflows} dir="in" narrative={report.inflowNarrative} maxValue={cardMax} />
      <FlowBlock title="资金流出" flows={outflows} dir="out" narrative={report.outflowNarrative} maxValue={cardMax} />

      <div className="key-point">{report.keyPoint}</div>
    </section>
  )
}

function ResidentPainSection() {
  const p = RESIDENT_PAIN
  return (
    <section className="subject-card pain-card">
      <header className="card-header">
        <div>
          <span className="cat-chip pain-chip">居民的视角</span>
          <div className="card-name">{p.title}</div>
        </div>
      </header>

      <p className="narrative intro-text">{p.intro}</p>

      <div className="pain-block">
        <div className="pain-title">{p.painFiscal.title}</div>
        <p className="narrative">{p.painFiscal.narrative}</p>
      </div>

      <div className="pain-block">
        <div className="pain-title">{p.painChannels.title}</div>
        <p className="narrative">{p.painChannels.narrative}</p>
        <div className="channel-list">
          {p.painChannels.channels.map((c) => (
            <div key={c.name} className="channel-row">
              <div className="channel-head">
                <span className="channel-name">{c.name}</span>
                <span className="channel-scale">{c.scale}</span>
                <span className="channel-status">{c.status}</span>
              </div>
              <div className="channel-detail">{c.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pain-block">
        <div className="pain-title">{p.divide.title}</div>
        <p className="narrative">{p.divide.narrative}</p>
      </div>

      <div className="key-point pain-point">{p.keyPoint}</div>
    </section>
  )
}

export default function ReportPage() {
  return (
    <div className="report-page">
      <div className="report-content">
        <div className="report-intro">
          <div className="report-title">五大部门资金流解读</div>
          <div className="report-sub">居民部门 · 财政部 · 地方政府 · 国有企业 · 民营企业 —— 钱从哪来、花到哪去</div>
          <p className="narrative">{REPORT_INTRO}</p>
        </div>

        {SUBJECT_REPORTS.map((r) =>
          r.nodeId === 'households' ? (
            <Fragment key={r.nodeId}>
              <SubjectCard report={r} />
              <ResidentPainSection />
            </Fragment>
          ) : (
            <SubjectCard key={r.nodeId} report={r} />
          )
        )}

        <SubjectCard report={PATIENT_CAPITAL} patient />

        <div className="report-footnote">
          口径说明：金额单位为人民币万亿元；除标注「年末存量」外均为 2025 年度流量。税收已拆分个税与企业税口径以避免重复计算。
          数据来源：财政部、人民银行、统计局、社保基金理事会、中投公司年报（个别 2024 年末口径已单独标注）。
        </div>
      </div>
    </div>
  )
}
