/** 图布局配置：节点相对坐标、画布留白、逐边弯曲度。 */

export const PAD = { x: 80, top: 46, bottom: 96 }

/**
 * 严格分层布局（0-1 相对坐标），自上而下五个层级：
 *   决策层 → 财政/货币层 → 财政·市场中介层 → 金融中介层 → 实体经济层
 * 左右两翼：左翼为"财政链"（收税→分配→基建），右翼为"货币链"（央行→银行→信贷）。
 */
export const LAYOUT: Record<string, [number, number]> = {
  'state-council': [0.5, 0.05],
  defense: [0.06, 0.2],
  moF: [0.27, 0.2],
  pboc: [0.8, 0.2],
  'local-gov': [0.06, 0.47],
  'public-sector': [0.27, 0.47],
  'bond-market': [0.53, 0.44],
  'policy-banks': [0.94, 0.44],
  'capital-market': [0.27, 0.71],
  banks: [0.74, 0.68],
  'national-fund': [0.35, 0.58],
  insurance: [0.66, 0.52],
  'social-security': [0.48, 0.78],
  soe: [0.06, 0.93],
  'private-firms': [0.4, 0.95],
  households: [0.67, 0.93],
  external: [0.94, 0.87],
}

/**
 * 逐边弯曲度（key: source->target）。正值 = 向行进方向右侧鼓出。
 * 用于把跨层长边（税收、上缴）甩到左右两翼外围，避免横穿中部节点群；
 * 反向边对（如 存款/贷款、准备金/投放、工资/消费）用同号曲率自然分离成透镜形。
 */
export const EDGE_CURVENESS: Record<string, number> = {
  'households->moF': 0.55, // 税收：沿左翼外围大弧上行
  'private-firms->moF': 0.12, // 税收：沿中部通道近直上行
  'soe->moF': -0.15, // 国资上缴：穿行于体制内与资本市场之间
  'bond-market->moF': 0.22,
  'moF->bond-market': 0.22, // 付息：与发行边反向分离
  'banks->bond-market': 0.15,
  'pboc->bond-market': 0.18,
  'moF->local-gov': 0.15,
  'moF->defense': -0.2, // 略向上鼓，避开下方节点
  'moF->public-sector': 0.1,
  'local-gov->public-sector': 0.15,
  'public-sector->households': 0.18,
  'local-gov->soe': 0.1,
  'capital-market->local-gov': 0.18, // 地方债募资：向左下鼓，避开体制内节点
  'households->banks': 0.18, // 存款
  'banks->households': 0.18, // 消费贷（反向分离）
  'banks->pboc': 0.2, // 准备金
  'pboc->banks': 0.2, // 基础货币（反向分离）
  'banks->private-firms': 0.15,
  'banks->soe': -0.2, // 向左上鼓，避开底部实体节点
  'pboc->policy-banks': 0.15,
  'policy-banks->soe': -0.12, // 穿越中部空隙（底部被民企挡住）
  'households->capital-market': 0.15,
  'capital-market->households': 0.15, // 财产净收入：与理财边同号曲率 → 透镜分离
  'capital-market->private-firms': 0.15,
  // private-firms->households 有两条平行边（工资/经营），曲率由各自 curve 字段指定
  'households->private-firms': 0.2, // 消费：向下鼓（反向分离）
  'external->pboc': -0.2, // 沿右翼外围上行
  // —— 基金类节点（社保/保险/国家基金）相关边 ——
  'households->social-security': 0.2, // 社保缴费
  'social-security->households': 0.2, // 养老金发放（反向分离成透镜）
  'moF->social-security': 0.35, // 财政补贴：向右大弧，避开体制内/国家基金
  'social-security->capital-market': 0.15,
  'social-security->banks': 0.18,
  'households->insurance': -0.22, // 保费：向上鼓，避开银行节点
  'insurance->bond-market': 0.15,
  'insurance->capital-market': -0.28, // 股基配置：向下大弧，避开国家基金/社保
  'insurance->banks': 0.15,
  'moF->national-fund': 0.28, // 财政注资：向右弧，避开体制内节点
  'national-fund->capital-market': 0.15,
  'national-fund->external': 0.3, // 中投境外：长边向右下大弧
}

export const DEFAULT_CURVENESS = 0.15
