import { NODES, CATEGORY_META, nameById } from '../data/nodes'
import { FLOWS, MAX_AMOUNT, fmtWanYi, flowColor } from '../data/flows'
import type { FlowEdge } from '../data/flows'

interface Props {
  selectedId: string | null
  onClose: () => void
}

function FlowList({ flows, dir, nodeName }: { flows: FlowEdge[]; dir: 'in' | 'out'; nodeName: string }) {
  if (flows.length === 0) return null
  const total = flows.reduce((a, f) => a + f.amount, 0)
  return (
    <div className="flow-section">
      <div className="section-title">
        {dir === 'in' ? '资金流入' : '资金流出'}
        <span className="section-total">{fmtWanYi(total)}/年</span>
      </div>
      <div className="flow-list">
        {flows.map((f) => (
          <div key={`${f.source}-${f.target}-${f.label}`} className="flow-row">
            <span className={`flow-arrow ${dir === 'in' ? 'arrow-in' : 'arrow-out'}`}>
              {dir === 'in' ? '⇣' : '⇢'}
            </span>
            <div className="flow-body">
              <div className="flow-head">
                <span className="flow-name">{f.label}</span>
                <span className="flow-amount">{fmtWanYi(f.amount)}</span>
              </div>
              <div className="flow-detail">
                {dir === 'in' ? `${nameById(f.source)} → ${nodeName}` : `${nodeName} → ${nameById(f.target)}`}
              </div>
              <div
                className="flow-bar"
                style={{
                  width: `${Math.max(4, Math.sqrt(f.amount / MAX_AMOUNT) * 100)}%`,
                  background: flowColor(f.amount),
                }}
              />
              <div className="flow-note">{f.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function NodePanel({ selectedId, onClose }: Props) {
  const node = NODES.find((n) => n.id === selectedId)
  if (!node) return null
  const cat = CATEGORY_META[node.category]
  const flowsIn = FLOWS.filter((f) => f.target === node.id)
  const flowsOut = FLOWS.filter((f) => f.source === node.id)

  return (
    <aside className="panel">
      <div className="panel-header">
        <div>
          <span className="cat-chip" style={{ color: cat.color, borderColor: cat.color }}>
            {cat.label}
          </span>
          <div className="panel-name">{node.name}</div>
          <div className="panel-tagline">{node.tagline}</div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="关闭">
          ✕
        </button>
      </div>

      <div className="stat-grid">
        {node.stats.map((s) => (
          <div key={s.label} className="stat-box">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flow-section">
        <div className="section-title">机制与角色</div>
        <p className="role-text">{node.role}</p>
      </div>

      <FlowList flows={flowsIn} dir="in" nodeName={node.name} />
      <FlowList flows={flowsOut} dir="out" nodeName={node.name} />
    </aside>
  )
}
