import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

export type AppLocale = 'zh-CN' | 'zh-TW' | 'en' | 'ru' | 'fa' | 'ar'
type TextDirection = 'ltr' | 'rtl'
type RainbowLocale = 'zh-CN' | 'zh-TW' | 'en' | 'ru' | 'ar'

interface LocaleOption {
  value: AppLocale
  label: string
  nativeLabel: string
  direction: TextDirection
}

type MessageTree = {
  common: {
    brand: string
    projectName: string
    networkName: string
    dayUnitShort: string
    minutesShort: string
    connectedWallet: string
    connectWalletPrompt: string
    statusConfirmed: string
    daySettlementWindow: string
    cycleMatrixValue: string
    highestRouteValue: string
    nodeThresholdValue: string
    cycleMatrix: string
    highestRoute: string
    networkLabel: string
    probabilityLabel: string
    settlementLabel: string
    teamTargetLabel: string
    cumulativeRatioLabel: string
  }
  navigation: {
    home: string
    routes: string
    vault: string
    network: string
    node: string
  }
  home: {
    notice: string
    unlockAccess: string
    viewRoutes: string
    liveRouteFlow: string
    featuredOrder: string
    orderId: string
    subscription: string
    confirmedCycle: string
    userSettlement: string
  }
  routes: {
    eyebrow: string
    title: string
    subtitle: string
    amountLabel: string
    refreshPreview: string
    submitOrder: string
    previewResult: string
    randomCycle: string
    settlementMultiplier: string
    grossReturn: string
    userSettlement: string
    nurReward: string
    maturity: string
  }
  community: {
    eyebrow: string
    title: string
    subtitle: string
    totalMembers: string
    activeAmbassadors: string
    inviteRewards: string
    contributionScore: string
    levelProgress: string
  }
  node: {
    eyebrow: string
    title: string
    subtitle: string
    nodeThreshold: string
    activeNodes: string
    routeIncome: string
    marketTaxFlow: string
    applyForNode: string
    viewRights: string
    rights: string
  }
  wallet: {
    eyebrow: string
    title: string
    subtitle: string
    network: string
    totalSupply: string
    sellProfitTax: string
    sellCooldown: string
    tokenRules: string
    rewardTrigger: string
    rewardInventory: string
    issuedRewards: string
    nodeThreshold: string
  }
  data: {
    heroTitle: string
    heroSubtitle: string
    announcement: string
    routeNames: [string, string, string]
    routeStatuses: [string, string, string]
    nodeRights: [string, string, string]
    rewardTrigger: string
    orderShare: string
    marketShare: string
  }
}

const STORAGE_KEY = 'nur_locale'

export const localeOptions: LocaleOption[] = [
  { value: 'zh-CN', label: 'Simplified Chinese', nativeLabel: '简体中文', direction: 'ltr' },
  { value: 'zh-TW', label: 'Traditional Chinese', nativeLabel: '繁體中文', direction: 'ltr' },
  { value: 'en', label: 'English', nativeLabel: 'English', direction: 'ltr' },
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский', direction: 'ltr' },
  { value: 'fa', label: 'Persian', nativeLabel: 'فارسی', direction: 'rtl' },
  { value: 'ar', label: 'Arabic', nativeLabel: 'العربية', direction: 'rtl' },
]

const messages: Record<AppLocale, MessageTree> = {
  'zh-CN': {
    common: {
      brand: 'NUR',
      projectName: 'NUR 能源准入',
      networkName: 'Polygon',
      dayUnitShort: '天',
      minutesShort: '分钟',
      connectedWallet: '已连接钱包',
      connectWalletPrompt: '连接钱包以访问 Polygon 上的 NUR 资产金库。',
      statusConfirmed: '已确认',
      daySettlementWindow: '{days}天结算窗口',
      cycleMatrixValue: '9档周期',
      highestRouteValue: '60天',
      nodeThresholdValue: '1,500 USDT',
      cycleMatrix: '周期矩阵',
      highestRoute: '最长周期',
      networkLabel: '网络',
      probabilityLabel: '{value} 概率',
      settlementLabel: '{value} 结算倍率',
      teamTargetLabel: '团队目标 {value}',
      cumulativeRatioLabel: '累计比例 {value}',
    },
    navigation: {
      home: '首页',
      routes: '航线',
      vault: '金库',
      network: '网络',
      node: '节点',
    },
    home: {
      notice: '项目公告',
      unlockAccess: '解锁准入',
      viewRoutes: '查看航线',
      liveRouteFlow: '实时航线流转',
      featuredOrder: '精选订单',
      orderId: '订单编号',
      subscription: '参与金额',
      confirmedCycle: '确认周期',
      userSettlement: '用户结算',
    },
    routes: {
      eyebrow: '航线',
      title: '航线认购',
      subtitle: '每笔订单先进入当前 NUR 周期池，再按确认航线窗口进行结算。',
      amountLabel: '认购金额（1 - 1000 USDT）',
      refreshPreview: '刷新预估',
      submitOrder: '提交订单',
      previewResult: '预估结果',
      randomCycle: '随机周期',
      settlementMultiplier: '结算倍率',
      grossReturn: '总回款',
      userSettlement: '用户结算',
      nurReward: 'NUR 激励',
      maturity: '到期说明',
    },
    community: {
      eyebrow: '网络',
      title: '大使网络',
      subtitle: '社区增长遵循当前 NUR 大使阶梯，并按等级进行级差奖励分配。',
      totalMembers: '总成员数',
      activeAmbassadors: '活跃大使',
      inviteRewards: '邀请奖励',
      contributionScore: '贡献分',
      levelProgress: '等级进度',
    },
    node: {
      eyebrow: '节点',
      title: '共建节点',
      subtitle: '累计参与达到 1,500 USDT 后可申请节点资格，并接入航线利润与代币税流。',
      nodeThreshold: '节点门槛',
      activeNodes: '活跃节点',
      routeIncome: '航线收益流',
      marketTaxFlow: '市场税流',
      applyForNode: '申请节点',
      viewRights: '查看权益',
      rights: '节点权益',
    },
    wallet: {
      eyebrow: '金库',
      title: '钱包与代币',
      subtitle: 'NUR 运行于 Polygon，用于 60 天奖励、市场利润税回流以及节点侧价值流转。',
      network: '网络',
      totalSupply: '总量',
      sellProfitTax: '卖出利润税',
      sellCooldown: '卖出冷却',
      tokenRules: '代币规则',
      rewardTrigger: '奖励触发',
      rewardInventory: '奖励库存',
      issuedRewards: '已发奖励',
      nodeThreshold: '节点门槛',
    },
    data: {
      heroTitle: 'NUR 能源准入',
      heroSubtitle: '围绕周期结算、大使增长、节点协作与长周期 NUR 激励构建的航线参与网络。',
      announcement: '当前准入运行在 Polygon。航线结算遵循链上周期矩阵，运营内容由中心化运营协调。',
      routeNames: ['伊朗 -> 阿曼调和', '阿曼 -> 延布港', '延布 -> 公开市场'],
      routeStatuses: ['调和准备中', '海运转运中', '分发窗口中'],
      nodeRights: [
        '累计参与达到 1,500 USDT 后可获得节点资格',
        '承接来自航线结算与代币市场税的节点侧流量',
        '参与长期共建治理与支持池分配',
      ],
      rewardTrigger: '60天周期每 200 USDT 奖励 1 NUR',
      orderShare: '航线利润的 5%',
      marketShare: '代币市场税流入的 50%',
    },
  },
  'zh-TW': {
    common: {
      brand: 'NUR',
      projectName: 'NUR 能源準入',
      networkName: 'Polygon',
      dayUnitShort: '天',
      minutesShort: '分鐘',
      connectedWallet: '已連接錢包',
      connectWalletPrompt: '連接錢包以存取 Polygon 上的 NUR 資產金庫。',
      statusConfirmed: '已確認',
      daySettlementWindow: '{days}天結算視窗',
      cycleMatrixValue: '9檔週期',
      highestRouteValue: '60天',
      nodeThresholdValue: '1,500 USDT',
      cycleMatrix: '週期矩陣',
      highestRoute: '最長週期',
      networkLabel: '網路',
      probabilityLabel: '{value} 機率',
      settlementLabel: '{value} 結算倍率',
      teamTargetLabel: '團隊目標 {value}',
      cumulativeRatioLabel: '累計比例 {value}',
    },
    navigation: {
      home: '首頁',
      routes: '航線',
      vault: '金庫',
      network: '網路',
      node: '節點',
    },
    home: {
      notice: '專案公告',
      unlockAccess: '解鎖準入',
      viewRoutes: '查看航線',
      liveRouteFlow: '即時航線流轉',
      featuredOrder: '精選訂單',
      orderId: '訂單編號',
      subscription: '參與金額',
      confirmedCycle: '確認週期',
      userSettlement: '使用者結算',
    },
    routes: {
      eyebrow: '航線',
      title: '航線認購',
      subtitle: '每筆訂單先進入目前 NUR 週期池，再依確認航線視窗進行結算。',
      amountLabel: '認購金額（1 - 1000 USDT）',
      refreshPreview: '刷新預估',
      submitOrder: '提交訂單',
      previewResult: '預估結果',
      randomCycle: '隨機週期',
      settlementMultiplier: '結算倍率',
      grossReturn: '總回款',
      userSettlement: '使用者結算',
      nurReward: 'NUR 激勵',
      maturity: '到期說明',
    },
    community: {
      eyebrow: '網路',
      title: '大使網路',
      subtitle: '社群成長遵循目前 NUR 大使階梯，並依等級進行級差獎勵分配。',
      totalMembers: '總成員數',
      activeAmbassadors: '活躍大使',
      inviteRewards: '邀請獎勵',
      contributionScore: '貢獻分',
      levelProgress: '等級進度',
    },
    node: {
      eyebrow: '節點',
      title: '共建節點',
      subtitle: '累計參與達到 1,500 USDT 後可申請節點資格，並接入航線利潤與代幣稅流。',
      nodeThreshold: '節點門檻',
      activeNodes: '活躍節點',
      routeIncome: '航線收益流',
      marketTaxFlow: '市場稅流',
      applyForNode: '申請節點',
      viewRights: '查看權益',
      rights: '節點權益',
    },
    wallet: {
      eyebrow: '金庫',
      title: '錢包與代幣',
      subtitle: 'NUR 運行於 Polygon，用於 60 天獎勵、市場利潤稅回流以及節點側價值流轉。',
      network: '網路',
      totalSupply: '總量',
      sellProfitTax: '賣出利潤稅',
      sellCooldown: '賣出冷卻',
      tokenRules: '代幣規則',
      rewardTrigger: '獎勵觸發',
      rewardInventory: '獎勵庫存',
      issuedRewards: '已發獎勵',
      nodeThreshold: '節點門檻',
    },
    data: {
      heroTitle: 'NUR 能源準入',
      heroSubtitle: '圍繞週期結算、大使成長、節點協作與長週期 NUR 激勵構建的航線參與網路。',
      announcement: '目前準入運行在 Polygon。航線結算遵循鏈上週期矩陣，營運內容由中心化營運協調。',
      routeNames: ['伊朗 -> 阿曼調和', '阿曼 -> 延布港', '延布 -> 公開市場'],
      routeStatuses: ['調和準備中', '海運轉運中', '分發視窗中'],
      nodeRights: [
        '累計參與達到 1,500 USDT 後可取得節點資格',
        '承接來自航線結算與代幣市場稅的節點側流量',
        '參與長期共建治理與支持池分配',
      ],
      rewardTrigger: '60天週期每 200 USDT 獎勵 1 NUR',
      orderShare: '航線利潤的 5%',
      marketShare: '代幣市場稅流入的 50%',
    },
  },
  en: {
    common: {
      brand: 'NUR',
      projectName: 'NUR Energy Access',
      networkName: 'Polygon',
      dayUnitShort: 'D',
      minutesShort: 'min',
      connectedWallet: 'Connected wallet',
      connectWalletPrompt: 'Connect your wallet to access the Polygon NUR vault.',
      statusConfirmed: 'Confirmed',
      daySettlementWindow: '{days} day settlement window',
      cycleMatrixValue: '9 cycles',
      highestRouteValue: '60 days',
      nodeThresholdValue: '1,500 USDT',
      cycleMatrix: 'Cycle Matrix',
      highestRoute: 'Highest Route',
      networkLabel: 'Network',
      probabilityLabel: '{value} probability',
      settlementLabel: '{value} settlement',
      teamTargetLabel: 'Team target {value}',
      cumulativeRatioLabel: 'Cumulative ratio {value}',
    },
    navigation: {
      home: 'Home',
      routes: 'Routes',
      vault: 'Vault',
      network: 'Network',
      node: 'Node',
    },
    home: {
      notice: 'Project Notice',
      unlockAccess: 'Unlock Access',
      viewRoutes: 'View Routes',
      liveRouteFlow: 'Live Route Flow',
      featuredOrder: 'Featured Order',
      orderId: 'Order ID',
      subscription: 'Subscription',
      confirmedCycle: 'Confirmed Cycle',
      userSettlement: 'User Settlement',
    },
    routes: {
      eyebrow: 'Routes',
      title: 'Route Subscription',
      subtitle: 'Every order enters the active NUR cycle pool first, then settles by the confirmed route window.',
      amountLabel: 'Subscription Amount (1 - 1000 USDT)',
      refreshPreview: 'Refresh Preview',
      submitOrder: 'Submit Order',
      previewResult: 'Preview Result',
      randomCycle: 'Random Cycle',
      settlementMultiplier: 'Settlement Multiplier',
      grossReturn: 'Gross Return',
      userSettlement: 'User Settlement',
      nurReward: 'NUR Reward',
      maturity: 'Maturity',
    },
    community: {
      eyebrow: 'Network',
      title: 'Ambassador Network',
      subtitle: 'Community growth follows the active NUR ambassador ladder, with level-based differential rewards.',
      totalMembers: 'Total Members',
      activeAmbassadors: 'Active Ambassadors',
      inviteRewards: 'Invite Rewards',
      contributionScore: 'Contribution Score',
      levelProgress: 'Level Progress',
    },
    node: {
      eyebrow: 'Node',
      title: 'Co-build Node',
      subtitle: 'Node qualification starts after 1,500 USDT accumulated participation and connects route profit flow with token tax inflow.',
      nodeThreshold: 'Node Threshold',
      activeNodes: 'Active Nodes',
      routeIncome: 'Route Income',
      marketTaxFlow: 'Market Tax Flow',
      applyForNode: 'Apply for Node',
      viewRights: 'View Rights',
      rights: 'Node Rights',
    },
    wallet: {
      eyebrow: 'Vault',
      title: 'Wallet & Token',
      subtitle: 'NUR runs on Polygon and powers 60-day rewards, market profit tax routing, and node-side value flow.',
      network: 'Network',
      totalSupply: 'Total Supply',
      sellProfitTax: 'Sell Profit Tax',
      sellCooldown: 'Sell Cooldown',
      tokenRules: 'Token Rules',
      rewardTrigger: 'Reward Trigger',
      rewardInventory: 'Reward Inventory',
      issuedRewards: 'Issued Rewards',
      nodeThreshold: 'Node Threshold',
    },
    data: {
      heroTitle: 'NUR Energy Access',
      heroSubtitle: 'A route-based participation network built around cycle settlement, ambassador growth, node collaboration, and long-cycle NUR rewards.',
      announcement: 'Current access is running on Polygon. Route settlement follows the on-chain cycle matrix, while operations and content remain centrally coordinated.',
      routeNames: ['Iran -> Oman Blend', 'Oman -> Yanbu Port', 'Yanbu -> Open Market'],
      routeStatuses: ['Blend preparation', 'Maritime transfer', 'Distribution window'],
      nodeRights: [
        'Qualify after reaching 1,500 USDT accumulated participation',
        'Receive node-side flow from route settlement and token market tax',
        'Join long-term co-build governance and support allocation',
      ],
      rewardTrigger: '1 NUR per 200 USDT on 60-day routes',
      orderShare: '5% of route profit',
      marketShare: '50% of token market tax inflow',
    },
  },
  ru: {
    common: {
      brand: 'NUR',
      projectName: 'Энергетический доступ NUR',
      networkName: 'Polygon',
      dayUnitShort: 'д',
      minutesShort: 'мин',
      connectedWallet: 'Подключенный кошелек',
      connectWalletPrompt: 'Подключите кошелек, чтобы получить доступ к хранилищу NUR в Polygon.',
      statusConfirmed: 'Подтверждено',
      daySettlementWindow: 'Окно расчета {days} дней',
      cycleMatrixValue: '9 циклов',
      highestRouteValue: '60 дней',
      nodeThresholdValue: '1 500 USDT',
      cycleMatrix: 'Матрица циклов',
      highestRoute: 'Максимальный маршрут',
      networkLabel: 'Сеть',
      probabilityLabel: 'Вероятность {value}',
      settlementLabel: 'Расчет {value}',
      teamTargetLabel: 'Цель команды {value}',
      cumulativeRatioLabel: 'Накопленный коэффициент {value}',
    },
    navigation: {
      home: 'Главная',
      routes: 'Маршруты',
      vault: 'Хранилище',
      network: 'Сеть',
      node: 'Узел',
    },
    home: {
      notice: 'Уведомление проекта',
      unlockAccess: 'Открыть доступ',
      viewRoutes: 'Смотреть маршруты',
      liveRouteFlow: 'Текущий поток маршрутов',
      featuredOrder: 'Ключевой ордер',
      orderId: 'ID ордера',
      subscription: 'Участие',
      confirmedCycle: 'Подтвержденный цикл',
      userSettlement: 'Выплата пользователю',
    },
    routes: {
      eyebrow: 'Маршруты',
      title: 'Подписка на маршрут',
      subtitle: 'Каждый ордер сначала входит в активный пул циклов NUR, а затем рассчитывается по подтвержденному окну маршрута.',
      amountLabel: 'Сумма участия (1 - 1000 USDT)',
      refreshPreview: 'Обновить расчет',
      submitOrder: 'Отправить ордер',
      previewResult: 'Результат расчета',
      randomCycle: 'Случайный цикл',
      settlementMultiplier: 'Коэффициент расчета',
      grossReturn: 'Общий возврат',
      userSettlement: 'Выплата пользователю',
      nurReward: 'Награда NUR',
      maturity: 'Срок',
    },
    community: {
      eyebrow: 'Сеть',
      title: 'Сеть амбассадоров',
      subtitle: 'Рост сообщества следует активной лестнице амбассадоров NUR с дифференциальными наградами по уровням.',
      totalMembers: 'Всего участников',
      activeAmbassadors: 'Активные амбассадоры',
      inviteRewards: 'Награды за приглашения',
      contributionScore: 'Баллы вклада',
      levelProgress: 'Прогресс уровня',
    },
    node: {
      eyebrow: 'Узел',
      title: 'Совместный узел',
      subtitle: 'Квалификация узла начинается после накопленного участия в 1 500 USDT и связывает поток прибыли маршрута с налогом токена.',
      nodeThreshold: 'Порог узла',
      activeNodes: 'Активные узлы',
      routeIncome: 'Поток дохода маршрута',
      marketTaxFlow: 'Поток рыночного налога',
      applyForNode: 'Подать на узел',
      viewRights: 'Смотреть права',
      rights: 'Права узла',
    },
    wallet: {
      eyebrow: 'Хранилище',
      title: 'Кошелек и токен',
      subtitle: 'NUR работает в Polygon и обеспечивает 60-дневные награды, маршрутизацию налога на прибыль и поток ценности узлов.',
      network: 'Сеть',
      totalSupply: 'Общий объем',
      sellProfitTax: 'Налог на прибыль при продаже',
      sellCooldown: 'Пауза перед продажей',
      tokenRules: 'Правила токена',
      rewardTrigger: 'Триггер награды',
      rewardInventory: 'Резерв наград',
      issuedRewards: 'Выдано наград',
      nodeThreshold: 'Порог узла',
    },
    data: {
      heroTitle: 'Энергетический доступ NUR',
      heroSubtitle: 'Сеть участия по маршрутам, построенная вокруг расчетных циклов, роста амбассадоров, узлового сотрудничества и долгосрочных наград NUR.',
      announcement: 'Текущий доступ работает в Polygon. Расчет маршрутов следует ончейн-матрице циклов, а операции и контент координируются централизованно.',
      routeNames: ['Иран -> Смесь Оман', 'Оман -> Порт Янбу', 'Янбу -> Открытый рынок'],
      routeStatuses: ['Подготовка смеси', 'Морская перевозка', 'Окно распределения'],
      nodeRights: [
        'Квалификация после достижения 1 500 USDT накопленного участия',
        'Получение узлового потока от расчетов маршрутов и рыночного налога токена',
        'Участие в долгосрочном совместном управлении и распределении поддержки',
      ],
      rewardTrigger: '1 NUR за каждые 200 USDT на 60-дневных маршрутах',
      orderShare: '5% прибыли маршрута',
      marketShare: '50% притока налога токен-рынка',
    },
  },
  fa: {
    common: {
      brand: 'NUR',
      projectName: 'دسترسی انرژی NUR',
      networkName: 'Polygon',
      dayUnitShort: 'روز',
      minutesShort: 'دقیقه',
      connectedWallet: 'کیف پول متصل',
      connectWalletPrompt: 'برای دسترسی به خزانه NUR روی Polygon کیف پول خود را متصل کنید.',
      statusConfirmed: 'تایید شده',
      daySettlementWindow: 'پنجره تسویه {days} روزه',
      cycleMatrixValue: '۹ چرخه',
      highestRouteValue: '۶۰ روز',
      nodeThresholdValue: '۱٬۵۰۰ USDT',
      cycleMatrix: 'ماتریس چرخه',
      highestRoute: 'بیشترین مسیر',
      networkLabel: 'شبکه',
      probabilityLabel: 'احتمال {value}',
      settlementLabel: 'تسویه {value}',
      teamTargetLabel: 'هدف تیم {value}',
      cumulativeRatioLabel: 'نسبت تجمعی {value}',
    },
    navigation: {
      home: 'خانه',
      routes: 'مسیرها',
      vault: 'خزانه',
      network: 'شبکه',
      node: 'نود',
    },
    home: {
      notice: 'اطلاعیه پروژه',
      unlockAccess: 'فعال‌سازی دسترسی',
      viewRoutes: 'مشاهده مسیرها',
      liveRouteFlow: 'جریان زنده مسیر',
      featuredOrder: 'سفارش منتخب',
      orderId: 'شناسه سفارش',
      subscription: 'مبلغ مشارکت',
      confirmedCycle: 'چرخه تایید شده',
      userSettlement: 'تسویه کاربر',
    },
    routes: {
      eyebrow: 'مسیرها',
      title: 'اشتراک مسیر',
      subtitle: 'هر سفارش ابتدا وارد استخر فعال چرخه NUR می‌شود و سپس بر اساس پنجره تایید شده مسیر تسویه می‌گردد.',
      amountLabel: 'مبلغ مشارکت (۱ تا ۱۰۰۰ USDT)',
      refreshPreview: 'به‌روزرسانی پیش‌نمایش',
      submitOrder: 'ثبت سفارش',
      previewResult: 'نتیجه پیش‌نمایش',
      randomCycle: 'چرخه تصادفی',
      settlementMultiplier: 'ضریب تسویه',
      grossReturn: 'بازگشت کل',
      userSettlement: 'تسویه کاربر',
      nurReward: 'پاداش NUR',
      maturity: 'سررسید',
    },
    community: {
      eyebrow: 'شبکه',
      title: 'شبکه سفیران',
      subtitle: 'رشد جامعه از ساختار فعال سفیران NUR پیروی می‌کند و پاداش‌های اختلاف سطح بر اساس رتبه توزیع می‌شود.',
      totalMembers: 'کل اعضا',
      activeAmbassadors: 'سفیران فعال',
      inviteRewards: 'پاداش دعوت',
      contributionScore: 'امتیاز مشارکت',
      levelProgress: 'پیشرفت سطح',
    },
    node: {
      eyebrow: 'نود',
      title: 'نود هم‌ساز',
      subtitle: 'صلاحیت نود پس از رسیدن به ۱٬۵۰۰ USDT مشارکت انباشته آغاز می‌شود و جریان سود مسیر را به ورودی مالیات توکن متصل می‌کند.',
      nodeThreshold: 'آستانه نود',
      activeNodes: 'نودهای فعال',
      routeIncome: 'جریان درآمد مسیر',
      marketTaxFlow: 'جریان مالیات بازار',
      applyForNode: 'درخواست نود',
      viewRights: 'مشاهده حقوق',
      rights: 'حقوق نود',
    },
    wallet: {
      eyebrow: 'خزانه',
      title: 'کیف پول و توکن',
      subtitle: 'NUR روی Polygon اجرا می‌شود و پاداش ۶۰ روزه، مسیر مالیات سود بازار و جریان ارزش نود را پشتیبانی می‌کند.',
      network: 'شبکه',
      totalSupply: 'عرضه کل',
      sellProfitTax: 'مالیات سود فروش',
      sellCooldown: 'وقفه فروش',
      tokenRules: 'قوانین توکن',
      rewardTrigger: 'محرک پاداش',
      rewardInventory: 'ذخیره پاداش',
      issuedRewards: 'پاداش‌های صادر شده',
      nodeThreshold: 'آستانه نود',
    },
    data: {
      heroTitle: 'دسترسی انرژی NUR',
      heroSubtitle: 'شبکه‌ای مبتنی بر مشارکت در مسیرها که حول تسویه چرخه، رشد سفیران، همکاری نودها و پاداش‌های بلندمدت NUR ساخته شده است.',
      announcement: 'دسترسی فعلی روی Polygon فعال است. تسویه مسیرها از ماتریس چرخه روی زنجیره پیروی می‌کند و عملیات و محتوا به‌صورت متمرکز هماهنگ می‌شود.',
      routeNames: ['ایران -> ترکیب عمان', 'عمان -> بندر ینبع', 'ینبع -> بازار آزاد'],
      routeStatuses: ['آماده‌سازی ترکیب', 'انتقال دریایی', 'پنجره توزیع'],
      nodeRights: [
        'کسب صلاحیت پس از رسیدن به ۱٬۵۰۰ USDT مشارکت انباشته',
        'دریافت جریان سمت نود از تسویه مسیر و مالیات بازار توکن',
        'پیوستن به حکمرانی بلندمدت و تخصیص پشتیبانی',
      ],
      rewardTrigger: 'برای هر ۲۰۰ USDT در مسیر ۶۰ روزه، ۱ NUR',
      orderShare: '۵٪ از سود مسیر',
      marketShare: '۵۰٪ از ورودی مالیات بازار توکن',
    },
  },
  ar: {
    common: {
      brand: 'NUR',
      projectName: 'وصول الطاقة من NUR',
      networkName: 'Polygon',
      dayUnitShort: 'يوم',
      minutesShort: 'دقيقة',
      connectedWallet: 'المحفظة المتصلة',
      connectWalletPrompt: 'قم بربط محفظتك للوصول إلى خزنة NUR على Polygon.',
      statusConfirmed: 'مؤكد',
      daySettlementWindow: 'نافذة تسوية لمدة {days}',
      cycleMatrixValue: '9 دورات',
      highestRouteValue: '60 يومًا',
      nodeThresholdValue: '1,500 USDT',
      cycleMatrix: 'مصفوفة الدورات',
      highestRoute: 'أعلى مسار',
      networkLabel: 'الشبكة',
      probabilityLabel: 'احتمال {value}',
      settlementLabel: 'تسوية {value}',
      teamTargetLabel: 'هدف الفريق {value}',
      cumulativeRatioLabel: 'النسبة التراكمية {value}',
    },
    navigation: {
      home: 'الرئيسية',
      routes: 'المسارات',
      vault: 'الخزنة',
      network: 'الشبكة',
      node: 'العقدة',
    },
    home: {
      notice: 'إشعار المشروع',
      unlockAccess: 'فتح الوصول',
      viewRoutes: 'عرض المسارات',
      liveRouteFlow: 'تدفق المسارات المباشر',
      featuredOrder: 'الطلب المميز',
      orderId: 'رقم الطلب',
      subscription: 'قيمة المشاركة',
      confirmedCycle: 'الدورة المؤكدة',
      userSettlement: 'تسوية المستخدم',
    },
    routes: {
      eyebrow: 'المسارات',
      title: 'اشتراك المسار',
      subtitle: 'يدخل كل طلب أولاً إلى مجمع دورات NUR النشط، ثم تتم تسويته وفق نافذة المسار المؤكدة.',
      amountLabel: 'مبلغ المشاركة (1 - 1000 USDT)',
      refreshPreview: 'تحديث المعاينة',
      submitOrder: 'إرسال الطلب',
      previewResult: 'نتيجة المعاينة',
      randomCycle: 'الدورة العشوائية',
      settlementMultiplier: 'مضاعف التسوية',
      grossReturn: 'العائد الإجمالي',
      userSettlement: 'تسوية المستخدم',
      nurReward: 'مكافأة NUR',
      maturity: 'الاستحقاق',
    },
    community: {
      eyebrow: 'الشبكة',
      title: 'شبكة السفراء',
      subtitle: 'يتبع نمو المجتمع سلم سفراء NUR النشط مع مكافآت تفاضلية حسب المستوى.',
      totalMembers: 'إجمالي الأعضاء',
      activeAmbassadors: 'السفراء النشطون',
      inviteRewards: 'مكافآت الدعوة',
      contributionScore: 'درجة المساهمة',
      levelProgress: 'تقدم المستوى',
    },
    node: {
      eyebrow: 'العقدة',
      title: 'عقدة البناء المشترك',
      subtitle: 'تبدأ أهلية العقدة بعد وصول المشاركة التراكمية إلى 1,500 USDT، وتربط تدفق أرباح المسار بتدفق ضريبة الرمز.',
      nodeThreshold: 'حد العقدة',
      activeNodes: 'العقد النشطة',
      routeIncome: 'تدفق دخل المسار',
      marketTaxFlow: 'تدفق ضريبة السوق',
      applyForNode: 'التقدم للعقدة',
      viewRights: 'عرض الحقوق',
      rights: 'حقوق العقدة',
    },
    wallet: {
      eyebrow: 'الخزنة',
      title: 'المحفظة والرمز',
      subtitle: 'يعمل NUR على Polygon ويدعم مكافآت 60 يومًا ومسار ضريبة أرباح السوق وتدفق القيمة إلى جهة العقدة.',
      network: 'الشبكة',
      totalSupply: 'الإجمالي',
      sellProfitTax: 'ضريبة ربح البيع',
      sellCooldown: 'تهدئة البيع',
      tokenRules: 'قواعد الرمز',
      rewardTrigger: 'مُشغّل المكافأة',
      rewardInventory: 'مخزون المكافآت',
      issuedRewards: 'المكافآت المصروفة',
      nodeThreshold: 'حد العقدة',
    },
    data: {
      heroTitle: 'وصول الطاقة من NUR',
      heroSubtitle: 'شبكة مشاركة قائمة على المسارات مبنية حول تسوية الدورات ونمو السفراء وتعاون العقد ومكافآت NUR طويلة الدورة.',
      announcement: 'الوصول الحالي يعمل على Polygon. تسوية المسارات تتبع مصفوفة الدورات على السلسلة، بينما تبقى العمليات والمحتوى منسقة مركزيًا.',
      routeNames: ['إيران -> مزج عمان', 'عمان -> ميناء ينبع', 'ينبع -> السوق المفتوح'],
      routeStatuses: ['تجهيز المزج', 'نقل بحري', 'نافذة التوزيع'],
      nodeRights: [
        'التأهل بعد الوصول إلى 1,500 USDT من المشاركة التراكمية',
        'استلام تدفق جهة العقدة من تسوية المسار وضريبة سوق الرمز',
        'الانضمام إلى الحوكمة المشتركة طويلة الأجل وتوزيع الدعم',
      ],
      rewardTrigger: '1 NUR لكل 200 USDT على مسارات 60 يومًا',
      orderShare: '5% من ربح المسار',
      marketShare: '50% من تدفق ضريبة سوق الرمز',
    },
  },
}

function readStoredLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as AppLocale | null
  if (stored && stored in messages) {
    return stored
  }

  const browserLocale = window.navigator.language
  const matched = localeOptions.find((item) => browserLocale.toLowerCase().startsWith(item.value.toLowerCase()))
  return matched?.value ?? 'en'
}

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}

interface I18nContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  direction: TextDirection
  isRtl: boolean
  messages: MessageTree
  rainbowLocale: RainbowLocale
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  formatCurrency: (value: number, options?: Intl.NumberFormatOptions) => string
  formatPercent: (value: number, options?: Intl.NumberFormatOptions) => string
  formatDaysShort: (days: number) => string
  formatDayWindow: (days: number) => string
  formatTemplate: (template: string, values: Record<string, string>) => string
}

const rainbowLocaleMap: Record<AppLocale, RainbowLocale> = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  en: 'en',
  ru: 'ru',
  fa: 'ar',
  ar: 'ar',
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<AppLocale>(readStoredLocale)
  const direction = localeOptions.find((item) => item.value === locale)?.direction ?? 'ltr'
  const isRtl = direction === 'rtl'

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [direction, locale])

  const value = useMemo<I18nContextValue>(() => {
    const activeMessages = messages[locale]

    return {
      locale,
      setLocale,
      direction,
      isRtl,
      messages: activeMessages,
      rainbowLocale: rainbowLocaleMap[locale],
      formatNumber: (value, options) => new Intl.NumberFormat(locale, options).format(value),
      formatCurrency: (value, options) =>
        new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
          ...options,
        }).format(value),
      formatPercent: (value, options) =>
        new Intl.NumberFormat(locale, {
          style: 'percent',
          maximumFractionDigits: 0,
          ...options,
        }).format(value),
      formatDaysShort: (days) => `${new Intl.NumberFormat(locale).format(days)}${activeMessages.common.dayUnitShort}`,
      formatDayWindow: (days) =>
        interpolate(activeMessages.common.daySettlementWindow, {
          days: new Intl.NumberFormat(locale).format(days),
        }),
      formatTemplate: interpolate,
    }
  }, [direction, isRtl, locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }

  return context
}

export function getMessages(locale: AppLocale) {
  return messages[locale]
}
