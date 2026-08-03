export type PageId = 'graph' | 'report'

interface Props {
  page: PageId
  onNavigate: (p: PageId) => void
}

const ITEMS: { id: PageId; icon: string; label: string; sub: string }[] = [
  { id: 'graph', icon: '◈', label: '流动全景', sub: '资金从哪来、到哪去' },
  { id: 'report', icon: '▤', label: '部门解读', sub: '五大部门 · 耐心资本' },
]

export default function Sidebar({ page, onNavigate }: Props) {
  return (
    <nav className="sidebar">
      {ITEMS.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`nav-item ${page === it.id ? 'active' : ''}`}
          onClick={() => onNavigate(it.id)}
        >
          <span className="nav-icon">{it.icon}</span>
          <span className="nav-text">
            <span className="nav-label">{it.label}</span>
            <span className="nav-sub">{it.sub}</span>
          </span>
        </button>
      ))}
    </nav>
  )
}
