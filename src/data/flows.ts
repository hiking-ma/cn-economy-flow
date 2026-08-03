/** 资金流边定义：主体之间的资金流动（2025 年度/年末，公开统计快照）。 */

export interface FlowEdge {
  source: string
  target: string
  /** 资金流名称（工具/渠道） */
  label: string
  /** 年度流量规模（亿元） */
  amount: number
  /** 存量规模（亿元），用于标注余额类流（如存款余额） */
  stock?: number
  /** 流向说明 */
  note: string
  /** 单独指定弯曲度（用于同源同目标的平行边，覆盖按 source->target 的默认查表） */
  curve?: number
}

/** 从 ECharts 线性色带取色：大额热色（红），小额冷色（蓝） */
export function flowColor(amount: number): string {
  if (amount >= 100000) return '#e05a4e' // ≥10万亿
  if (amount >= 30000) return '#e0834e' // ≥3万亿
  if (amount >= 10000) return '#f2a33c' // ≥1万亿
  return '#5aa7e0' // <1万亿
}

export function fmtWanYi(v: number): string {
  return `${parseFloat((v / 10000).toFixed(2))} 万亿`
}

export const FLOWS: FlowEdge[] = [
  {
    source: 'households',
    target: 'moF',
    label: '个人所得税',
    amount: 16200,
    stock: 0,
    note: '2025 年个人所得税 1.62 万亿（+11.5%）。增值税/消费税等流转税虽由居民最终负担，但由企业代扣代缴，统计上计入企业缴税（见"企业所得税 / 增值税等"）。',
  },
  {
    source: 'private-firms',
    target: 'moF',
    label: '企业所得税 / 增值税等',
    amount: 160200,
    stock: 0,
    note: '企业所得税、增值税、消费税等合计约 16.02 万亿——企业是税收的主要缴纳方（含代扣代缴），与个人所得税合计 17.64 万亿；2025 年税收占一般公共预算收入约 82%。',
  },
  {
    source: 'bond-market',
    target: 'moF',
    label: '国债发行募资',
    amount: 160000,
    stock: 0,
    note: '2025 年国债发行约 16 万亿（含到期续发的再融资债券），募集资金归入中央财政；其中超长期特别国债 1.3 万亿、0.5 万亿特别国债用于补充国有大行资本。',
  },
  {
    source: 'banks',
    target: 'bond-market',
    label: '认购国债',
    amount: 100000,
    stock: 0,
    note: '商业银行是国债最大持有者（近年约六成以上），认购款是国债资金的主要来源；换来的国债又可作优质抵押品与流动性工具。',
  },
  {
    source: 'pboc',
    target: 'bond-market',
    label: '央行二级市场买债',
    amount: 10000,
    stock: 0,
    note: '2024 年 8 月起央行开展国债买卖操作，2025 年 10 月恢复净买入（约 0.1 万亿规模），成为基础货币投放新渠道。',
  },
  {
    source: 'moF',
    target: 'local-gov',
    label: '转移支付',
    amount: 101800,
    stock: 0,
    note: '2025 年中央对地方一般公共预算转移支付 10.18 万亿元（决算数），占地方一般公共预算支出的一半以上。',
  },
  {
    source: 'moF',
    target: 'defense',
    label: '国防支出',
    amount: 17800,
    stock: 0,
    note: '2025 年中央国防支出 1.78 万亿元（+7.2%），增速连续多年高于财政收入增速（-1.7%）；占 GDP 约 1.3%，全额税收供养。',
  },
  {
    source: 'moF',
    target: 'public-sector',
    label: '中央本级人员经费',
    amount: 5000,
    stock: 0,
    note: '中央机关与垂直管理系统人员工资福利（估算）；2025 年中央本级支出约 4 万亿，扣除国防、付息、科教后人员与运转经费约占一成。',
  },
  {
    source: 'local-gov',
    target: 'public-sector',
    label: '地方人员经费',
    amount: 45000,
    stock: 0,
    note: '教师约 1500 万、医护约 1000 万与基层公务员等由地方财政供养（估算约 4.5 万亿），是"三保"（保工资、保运转、保基本民生）之首。',
  },
  {
    source: 'public-sector',
    target: 'households',
    label: '体制内工资与福利',
    amount: 48000,
    stock: 0,
    note: '4000 万+ 财政供养人员（公务员约 700~800 万 + 事业单位约 3100~4300 万，均为估算口径）的薪酬福利（估算约 4.8 万亿），人均约 12 万/年（2025 年城镇非私营单位平均工资 129441 元）。隐性福利厚重：养老金替代率约 80~90%（企业职工约 40%）、公积金与职业年金按高比例缴纳——是居民中收入确定性最高的群体。',
  },
  {
    source: 'moF',
    target: 'bond-market',
    label: '国债付息',
    amount: 8194,
    stock: 0,
    note: '2025 年中央一般公共预算债务付息 0.82 万亿元（决算数），随国债余额扩张逐年增长；利息经市场分配给银行、保险等持有人。',
  },
  {
    source: 'local-gov',
    target: 'soe',
    label: '基建投资 / 城投注资',
    amount: 60000,
    stock: 0,
    note: '2025 年地方基建与城投项目资金：新增专项债 4.4 万亿 + 土地出让金 4.15 万亿 + 平台融资投向基础设施与收储。',
  },
  {
    source: 'capital-market',
    target: 'local-gov',
    label: '地方债发行募资',
    amount: 103000,
    stock: 0,
    note: '2025 年地方债发行首次突破 10 万亿（新增约 5.2 万亿：专项债 4.4 + 一般债约 0.8）——地方政府发行债券，银行与保险认购并把资金缴给地方财政。',
  },
  {
    source: 'households',
    target: 'banks',
    label: '住户存款',
    amount: 146400,
    stock: 1658900,
    note: '2025 年住户存款新增 14.64 万亿，年末余额约 165.9 万亿——居民仍是银行体系最大的资金来源。',
  },
  {
    source: 'banks',
    target: 'pboc',
    label: '存款准备金',
    amount: 204000,
    stock: 204000,
    note: '存款准备金余额约 20 万亿（按 2025 年末存款 328.6 万亿 × 加权平均存准率约 6.2% 估算），是央行对冲基础货币的主要工具。',
  },
  {
    source: 'pboc',
    target: 'banks',
    label: '基础货币投放（MLF/逆回购/降准）',
    amount: 60000,
    stock: 0,
    note: '2025 年 5 月降准 0.5 个百分点（释放约 1 万亿长期资金）、政策利率下调 0.1 个百分点，MLF/逆回购/再贷款合计投放数万亿。',
  },
  {
    source: 'banks',
    target: 'private-firms',
    label: '企业贷款',
    amount: 154700,
    stock: 0,
    note: '2025 年企（事）业单位贷款新增 15.47 万亿，占全年人民币贷款增量（16.27 万亿）的九成以上。',
  },
  {
    source: 'banks',
    target: 'households',
    label: '住户贷款（房贷/消费贷）',
    amount: 4417,
    stock: 0,
    note: '2025 年住户贷款仅新增 0.44 万亿，房贷随地产调整持续收缩，消费贷在贴息等政策支持下扩张。',
  },
  {
    source: 'banks',
    target: 'soe',
    label: '国企/基建贷款',
    amount: 80000,
    stock: 0,
    note: '国企与基建项目是信贷的长期主力，政策性工具（PSL、保障性住房再贷款）定向支持。',
  },
  {
    source: 'pboc',
    target: 'policy-banks',
    label: 'PSL / 再贷款',
    amount: 15000,
    stock: 0,
    note: '抵押补充贷款（PSL）与各类结构性再贷款（科技创新/设备更新/保障房）定向投放；2025 年另设 0.5 万亿新型政策性金融工具补充项目资本金。',
  },
  {
    source: 'policy-banks',
    target: 'soe',
    label: '政策性贷款',
    amount: 30000,
    stock: 0,
    note: '国开行等政策性贷款投向基建、棚改、绿色与一带一路项目，期限长、利率低。',
  },
  {
    source: 'households',
    target: 'capital-market',
    label: '理财 / 基金 / 股票',
    amount: 60000,
    stock: 710000,
    note: '"存款搬家"加速：2025 年非银存款新增 6.41 万亿创历史新高；年末银行理财 33.3 万亿、公募基金接近 38 万亿。',
  },
  {
    source: 'capital-market',
    target: 'households',
    label: '财产净收入',
    amount: 49000,
    stock: 0,
    note: '2025 年居民人均财产净收入 3490 元（+1.6%，四分项中最慢），总额约 4.9 万亿：利息、股息、租金与自有住房折算租金。高度集中于高资产群体；普通居民的财产收入主要是存款利息与折算租金。',
  },
  {
    source: 'capital-market',
    target: 'private-firms',
    label: '股权 / 债券融资',
    amount: 60000,
    stock: 0,
    note: '2025 年社融增量 35.6 万亿，其中政府债券净融资 16.3 万亿；企业信用债与股权融资为直接融资主体。',
  },
  {
    source: 'private-firms',
    target: 'households',
    label: '市场化工资性收入',
    amount: 297000,
    stock: 0,
    curve: 0.32,
    note: '2025 年居民人均工资性收入 24555 元（+5.3%），总额约 34.5 万亿；扣除体制内约 4.8 万亿后，市场化工资约 29.7 万亿——覆盖约 4 亿+ 市场化就业者（城镇私营个体从业人员、农民工 30115 万、国企职工、灵活就业等），人均约 7 万/年（2025 年城镇私营单位平均工资 71590 元，仅为非私营单位的约 55%）。',
  },
  {
    source: 'private-firms',
    target: 'households',
    label: '经营净收入',
    amount: 102000,
    stock: 0,
    curve: 0.14,
    note: '2025 年居民人均经营净收入 7252 元（+5.0%），总额约 10.2 万亿——主要是 1.24 亿户个体工商户（支撑近 3 亿人就业）与农户的经营所得，人均约 3.4 万/年；内部分化极大，多数"小老板"实际收入不及打工。',
  },
  {
    source: 'households',
    target: 'private-firms',
    label: '消费支出',
    amount: 400000,
    stock: 0,
    note: '2025 年社会消费品零售总额 50.12 万亿（+3.7%），居民最终消费支出约 40 万亿（估算），是企业收入的核心来源。',
  },
  {
    source: 'external',
    target: 'pboc',
    label: '外汇占款 / 结售汇',
    amount: 10000,
    stock: 0,
    note: '2025 年货物贸易顺差 8.51 万亿，结汇形成外汇占款；年末外储 3.36 万亿美元，人民币升破 7（约 6.99）。',
  },
  {
    source: 'soe',
    target: 'moF',
    label: '国有资本收益上缴',
    amount: 8000,
    stock: 0,
    note: '国企上缴国有资本收益与利润，是财政非税收入的重要补充。',
  },
  {
    source: 'households',
    target: 'social-security',
    label: '社保缴费（单位 + 个人）',
    amount: 91198,
    stock: 0,
    note: '2025 年社保基金预算保险费收入 9.12 万亿元（单位缴费为雇主承担的劳动力成本，统计计入保费收入）；叠加财政补贴后总收入 12.60 万亿。',
  },
  {
    source: 'moF',
    target: 'social-security',
    label: '财政社保补贴',
    amount: 29115,
    stock: 0,
    note: '2025 年社保基金预算财政补贴收入 2.91 万亿元——财政是社保的"最终担保人"，补贴随老龄化加深逐年增长。',
  },
  {
    source: 'social-security',
    target: 'households',
    label: '养老金与社保发放',
    amount: 111414,
    stock: 0,
    note: '2025 年社保基金支出 11.14 万亿元，绝大部分为基本养老金发放——构成居民转移净收入（11.4 万亿）的主体。',
  },
  {
    source: 'social-security',
    target: 'capital-market',
    label: '委托投资与权益配置',
    amount: 68400,
    stock: 68400,
    note: '全国社保基金战略储备 0.33 万亿元（2024 年报，收益率 8.10%）+ 基本养老委托投资 0.35 万亿元（2025 末，收益率 5.76%），由社保基金理事会投向股债（存量）。',
  },
  {
    source: 'social-security',
    target: 'banks',
    label: '公积金与社保存款',
    amount: 109000,
    stock: 109000,
    note: '住房公积金缴存余额约 10.9 万亿，主要以存款形式沉淀银行并用于个人住房贷款（存量）；社保基金存款亦存放银行。',
  },
  {
    source: 'households',
    target: 'insurance',
    label: '保费收入',
    amount: 61000,
    stock: 0,
    note: '2025 年原保险保费收入 6.1 万亿（+7.4%），寿险为主；保费由保险公司归集形成 38.5 万亿投资池。',
  },
  {
    source: 'insurance',
    target: 'bond-market',
    label: '债券配置',
    amount: 194000,
    stock: 194000,
    note: '2025 年末险资债券配置占比 50.4%（约 19.4 万亿，同比 +0.9pp），以国债、地方债为主——债市最大长期机构投资者（存量）。',
  },
  {
    source: 'insurance',
    target: 'capital-market',
    label: '股基配置',
    amount: 59000,
    stock: 59000,
    note: '2025 年末险资股票配置 10.1%（同比 +2.5pp）、基金 5.3%，合计约 5.9 万亿——权益配置创近年新高（存量）。',
  },
  {
    source: 'insurance',
    target: 'banks',
    label: '存款配置',
    amount: 32000,
    stock: 32000,
    note: '2025 年末险资银行存款占比 8.2%（约 3.2 万亿，同比 -0.9pp）（存量）。',
  },
  {
    source: 'moF',
    target: 'national-fund',
    label: '财政注资与国资收益',
    amount: 8547,
    stock: 0,
    note: '2025 年全国国有资本经营预算收入 0.85 万亿元，用于国企注资与产业基金；大基金注册资本亦来自财政 + 国企 + 银行出资。',
  },
  {
    source: 'national-fund',
    target: 'capital-market',
    label: '硬科技股权 / 引导基金',
    amount: 65600,
    stock: 65600,
    note: '政府投资基金总规模约 6.56 万亿，以"母基金 + 子基金"撬动社会资本投向硬科技；大基金一/二/三期合计 0.65 万亿专注集成电路（存量）。',
  },
  {
    source: 'national-fund',
    target: 'external',
    label: '中投境外投资',
    amount: 110000,
    stock: 110000,
    note: '中投公司总资产 1.57 万亿美元（2024 年报，折人民币约 11 万亿），受托经营部分外汇储备开展境外股债投资（存量）。',
  },
]

/** FLOWS 中的最大年度流量（亿元），供图内连线粗细与面板条形长度做开方缩放 */
export const MAX_AMOUNT = Math.max(...FLOWS.map((f) => f.amount))

/** 政策指令边：决策中枢对财政/货币部门的部署，非资金流（虚线表示）。 */
export interface DirectiveEdge {
  source: string
  target: string
  label: string
  note: string
}

export const DIRECTIVES: DirectiveEdge[] = [
  {
    source: 'state-council',
    target: 'moF',
    label: '财政政策部署',
    note: '国务院/中央财经委审定预算、赤字率与国债发行计划，财政部负责执行——所有政府资金流的总开关。',
  },
  {
    source: 'state-council',
    target: 'pboc',
    label: '货币政策取向',
    note: '国务院确定货币政策取向（稳健/宽松），央行据此运用降准、利率与再贷款等工具投放基础货币。',
  },
]
