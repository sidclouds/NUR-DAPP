import type { AppLocale } from './i18n'

type UiTextKey =
  | 'ok'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'walletRequiredTitle'
  | 'walletRequiredPreviewMessage'
  | 'walletRequiredOrderMessage'
  | 'walletRequiredNodeMessage'
  | 'wrongNetworkTitle'
  | 'wrongNetworkOrderMessage'
  | 'wrongNetworkNodeMessage'
  | 'invalidAmountTitle'
  | 'invalidAmountMessage'
  | 'orderStateUnavailableTitle'
  | 'orderStateUnavailableMessage'
  | 'actionCompletedTitle'
  | 'actionFailedTitle'
  | 'previewRefreshedMessage'
  | 'preparationStillInsufficient'
  | 'recentWalletOrders'
  | 'noRouteOrdersForWallet'
  | 'connectWalletToReadOrders'
  | 'amount'
  | 'cycle'
  | 'pending'
  | 'withdraw'
  | 'withdrawing'
  | 'nodeStateUnavailableTitle'
  | 'nodeStateUnavailableMessage'
  | 'nodeAlreadyActiveTitle'
  | 'nodeAlreadyActiveMessage'
  | 'nodeThresholdNotReachedTitle'
  | 'nodeThresholdNotReachedMessage'
  | 'walletSnapshotUnavailableTitle'
  | 'walletSnapshotUnavailableMessage'
  | 'walletSnapshot'
  | 'walletNodeThreshold'
  | 'walletAccumulated'
  | 'remainingToNode'
  | 'walletNodeStatus'
  | 'activeShares'
  | 'currentLevel'
  | 'routeOrders'
  | 'nodeOrderIncome'
  | 'nodeMarketIncome'
  | 'active'
  | 'notYet'
  | 'activeNode'
  | 'notNode'
  | 'switchPolygon'

type UiTextMap = Record<UiTextKey, string>

const uiTexts: Record<AppLocale, UiTextMap> = {
  'zh-CN': {
    ok: '确定',
    info: '提示',
    success: '成功',
    warning: '注意',
    error: '错误',
    walletRequiredTitle: '需要连接钱包',
    walletRequiredPreviewMessage: '请先连接 Polygon 钱包，再刷新预估。',
    walletRequiredOrderMessage: '请先连接 Polygon 钱包，再提交订单。',
    walletRequiredNodeMessage: '请先连接 Polygon 钱包，再申请节点资格。',
    wrongNetworkTitle: '网络不正确',
    wrongNetworkOrderMessage: '请先将钱包网络切换到 Polygon，再提交订单。',
    wrongNetworkNodeMessage: '请先将钱包网络切换到 Polygon，再申请节点资格。',
    invalidAmountTitle: '金额无效',
    invalidAmountMessage: '认购金额必须保持在 1 到 1000 的结算区间内。',
    orderStateUnavailableTitle: '订单状态读取失败',
    orderStateUnavailableMessage: '当前无法读取链上订单状态，请稍后重试。',
    actionCompletedTitle: '操作完成',
    actionFailedTitle: '操作失败',
    previewRefreshedMessage: '预估已在本地签名后刷新。',
    preparationStillInsufficient: '准备交易已确认，但当前钱包授权额度仍不足。',
    recentWalletOrders: '最近钱包订单',
    noRouteOrdersForWallet: '当前钱包还没有航线订单。',
    connectWalletToReadOrders: '请先连接钱包以读取链上订单。',
    amount: '金额',
    cycle: '周期',
    pending: '待确认',
    withdraw: '提取',
    withdrawing: '提取中...',
    nodeStateUnavailableTitle: '节点状态读取失败',
    nodeStateUnavailableMessage: '当前无法读取节点状态，请稍后重试。',
    nodeAlreadyActiveTitle: '节点已激活',
    nodeAlreadyActiveMessage: '当前钱包已经拥有有效节点身份。',
    nodeThresholdNotReachedTitle: '未达到节点门槛',
    nodeThresholdNotReachedMessage:
      '当前累计参与为 {current}。\n节点激活要求达到 {threshold}。\n你还需要 {remaining} 的累计参与才能提交节点申请。',
    walletSnapshotUnavailableTitle: '钱包快照读取失败',
    walletSnapshotUnavailableMessage: '当前无法读取钱包快照，请稍后重试。',
    walletSnapshot: '钱包快照',
    walletNodeThreshold: '钱包节点门槛',
    walletAccumulated: '钱包累计参与',
    remainingToNode: '距离节点还差',
    walletNodeStatus: '钱包节点状态',
    activeShares: '活跃份额',
    currentLevel: '当前等级',
    routeOrders: '航线订单',
    nodeOrderIncome: '节点订单收益',
    nodeMarketIncome: '节点市场收益',
    active: '已激活',
    notYet: '未激活',
    activeNode: '已激活节点',
    notNode: '尚未成为节点',
    switchPolygon: '请将钱包网络切换到 Polygon。',
  },
  'zh-TW': {
    ok: '確定',
    info: '提示',
    success: '成功',
    warning: '注意',
    error: '錯誤',
    walletRequiredTitle: '需要連接錢包',
    walletRequiredPreviewMessage: '請先連接 Polygon 錢包，再刷新預估。',
    walletRequiredOrderMessage: '請先連接 Polygon 錢包，再提交訂單。',
    walletRequiredNodeMessage: '請先連接 Polygon 錢包，再申請節點資格。',
    wrongNetworkTitle: '網路不正確',
    wrongNetworkOrderMessage: '請先將錢包網路切換到 Polygon，再提交訂單。',
    wrongNetworkNodeMessage: '請先將錢包網路切換到 Polygon，再申請節點資格。',
    invalidAmountTitle: '金額無效',
    invalidAmountMessage: '認購金額必須保持在 1 到 1000 的結算區間內。',
    orderStateUnavailableTitle: '訂單狀態讀取失敗',
    orderStateUnavailableMessage: '目前無法讀取鏈上訂單狀態，請稍後再試。',
    actionCompletedTitle: '操作完成',
    actionFailedTitle: '操作失敗',
    previewRefreshedMessage: '預估已在本地簽名後刷新。',
    preparationStillInsufficient: '準備交易已確認，但目前錢包授權額度仍不足。',
    recentWalletOrders: '最近錢包訂單',
    noRouteOrdersForWallet: '目前錢包尚未有航線訂單。',
    connectWalletToReadOrders: '請先連接錢包以讀取鏈上訂單。',
    amount: '金額',
    cycle: '週期',
    pending: '待確認',
    withdraw: '提取',
    withdrawing: '提取中...',
    nodeStateUnavailableTitle: '節點狀態讀取失敗',
    nodeStateUnavailableMessage: '目前無法讀取節點狀態，請稍後再試。',
    nodeAlreadyActiveTitle: '節點已啟用',
    nodeAlreadyActiveMessage: '目前錢包已擁有有效節點身份。',
    nodeThresholdNotReachedTitle: '尚未達到節點門檻',
    nodeThresholdNotReachedMessage:
      '目前累計參與為 {current}。\n節點啟用要求達到 {threshold}。\n你還需要 {remaining} 的累計參與才能提交節點申請。',
    walletSnapshotUnavailableTitle: '錢包快照讀取失敗',
    walletSnapshotUnavailableMessage: '目前無法讀取錢包快照，請稍後再試。',
    walletSnapshot: '錢包快照',
    walletNodeThreshold: '錢包節點門檻',
    walletAccumulated: '錢包累計參與',
    remainingToNode: '距離節點尚差',
    walletNodeStatus: '錢包節點狀態',
    activeShares: '活躍份額',
    currentLevel: '當前等級',
    routeOrders: '航線訂單',
    nodeOrderIncome: '節點訂單收益',
    nodeMarketIncome: '節點市場收益',
    active: '已啟用',
    notYet: '未啟用',
    activeNode: '已啟用節點',
    notNode: '尚未成為節點',
    switchPolygon: '請將錢包網路切換到 Polygon。',
  },
  en: {
    ok: 'OK',
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    walletRequiredTitle: 'Wallet required',
    walletRequiredPreviewMessage: 'Connect your Polygon wallet before refreshing the preview.',
    walletRequiredOrderMessage: 'Connect your Polygon wallet before submitting a route order.',
    walletRequiredNodeMessage: 'Connect your Polygon wallet before applying for node activation.',
    wrongNetworkTitle: 'Wrong network',
    wrongNetworkOrderMessage: 'Switch your wallet network to Polygon before submitting this order.',
    wrongNetworkNodeMessage: 'Switch your wallet network to Polygon before applying for node activation.',
    invalidAmountTitle: 'Invalid amount',
    invalidAmountMessage: 'The subscription amount must stay within the 1 to 1000 settlement range.',
    orderStateUnavailableTitle: 'Order state unavailable',
    orderStateUnavailableMessage: 'Unable to load on-chain order state right now. Please try again shortly.',
    actionCompletedTitle: 'Action completed',
    actionFailedTitle: 'Action failed',
    previewRefreshedMessage: 'Preview refreshed after local signature.',
    preparationStillInsufficient: 'Preparation transaction confirmed, but wallet limit is still insufficient.',
    recentWalletOrders: 'Recent Wallet Orders',
    noRouteOrdersForWallet: 'No route orders found for this wallet.',
    connectWalletToReadOrders: 'Connect wallet to read on-chain orders.',
    amount: 'Amount',
    cycle: 'Cycle',
    pending: 'Pending',
    withdraw: 'Unstake',
    withdrawing: 'Withdrawing...',
    nodeStateUnavailableTitle: 'Node state unavailable',
    nodeStateUnavailableMessage: 'Unable to load node state right now. Please try again shortly.',
    nodeAlreadyActiveTitle: 'Node already active',
    nodeAlreadyActiveMessage: 'This wallet already holds an active node status.',
    nodeThresholdNotReachedTitle: 'Node threshold not reached',
    nodeThresholdNotReachedMessage:
      'Your current cumulative participation is {current}.\nNode activation requires {threshold}.\nYou still need {remaining} more cumulative participation before submitting this request.',
    walletSnapshotUnavailableTitle: 'Wallet snapshot unavailable',
    walletSnapshotUnavailableMessage: 'Unable to load the wallet snapshot right now. Please try again shortly.',
    walletSnapshot: 'Wallet Snapshot',
    walletNodeThreshold: 'Wallet Node Threshold',
    walletAccumulated: 'Wallet Accumulated',
    remainingToNode: 'Remaining to Node',
    walletNodeStatus: 'Wallet Node Status',
    activeShares: 'Active Shares',
    currentLevel: 'Current Level',
    routeOrders: 'Route Orders',
    nodeOrderIncome: 'Node Order Income',
    nodeMarketIncome: 'Node Market Income',
    active: 'Active',
    notYet: 'Not yet',
    activeNode: 'Active Node',
    notNode: 'Not a node',
    switchPolygon: 'Switch wallet network to Polygon.',
  },
  ru: {
    ok: 'OK',
    info: 'Инфо',
    success: 'Успех',
    warning: 'Внимание',
    error: 'Ошибка',
    walletRequiredTitle: 'Требуется кошелек',
    walletRequiredPreviewMessage: 'Подключите кошелек Polygon перед обновлением прогноза.',
    walletRequiredOrderMessage: 'Подключите кошелек Polygon перед отправкой ордера.',
    walletRequiredNodeMessage: 'Подключите кошелек Polygon перед подачей заявки на узел.',
    wrongNetworkTitle: 'Неверная сеть',
    wrongNetworkOrderMessage: 'Переключите сеть кошелька на Polygon перед отправкой ордера.',
    wrongNetworkNodeMessage: 'Переключите сеть кошелька на Polygon перед подачей заявки на узел.',
    invalidAmountTitle: 'Неверная сумма',
    invalidAmountMessage: 'Сумма участия должна быть в диапазоне от 1 до 1000.',
    orderStateUnavailableTitle: 'Состояние ордеров недоступно',
    orderStateUnavailableMessage: 'Сейчас не удалось загрузить состояние ордеров из сети. Повторите позже.',
    actionCompletedTitle: 'Действие выполнено',
    actionFailedTitle: 'Действие не удалось',
    previewRefreshedMessage: 'Прогноз обновлен после локальной подписи.',
    preparationStillInsufficient: 'Подготовительная транзакция подтверждена, но лимит кошелька все еще недостаточен.',
    recentWalletOrders: 'Последние ордера кошелька',
    noRouteOrdersForWallet: 'Для этого кошелька маршруты еще не найдены.',
    connectWalletToReadOrders: 'Подключите кошелек, чтобы читать ордера из сети.',
    amount: 'Сумма',
    cycle: 'Цикл',
    pending: 'Ожидание',
    withdraw: 'Вывести',
    withdrawing: 'Вывод...',
    nodeStateUnavailableTitle: 'Состояние узла недоступно',
    nodeStateUnavailableMessage: 'Сейчас не удалось загрузить состояние узла. Повторите позже.',
    nodeAlreadyActiveTitle: 'Узел уже активен',
    nodeAlreadyActiveMessage: 'Этот кошелек уже имеет активный статус узла.',
    nodeThresholdNotReachedTitle: 'Порог узла не достигнут',
    nodeThresholdNotReachedMessage:
      'Ваш текущий накопленный объем участия: {current}.\nДля активации узла требуется {threshold}.\nВам нужно еще {remaining} накопленного участия перед отправкой заявки.',
    walletSnapshotUnavailableTitle: 'Снимок кошелька недоступен',
    walletSnapshotUnavailableMessage: 'Сейчас не удалось загрузить снимок кошелька. Повторите позже.',
    walletSnapshot: 'Снимок кошелька',
    walletNodeThreshold: 'Порог узла',
    walletAccumulated: 'Накопленное участие',
    remainingToNode: 'Осталось до узла',
    walletNodeStatus: 'Статус узла',
    activeShares: 'Активные доли',
    currentLevel: 'Текущий уровень',
    routeOrders: 'Маршрутные ордера',
    nodeOrderIncome: 'Доход узла от ордеров',
    nodeMarketIncome: 'Доход узла от рынка',
    active: 'Активен',
    notYet: 'Еще нет',
    activeNode: 'Активный узел',
    notNode: 'Не является узлом',
    switchPolygon: 'Переключите сеть кошелька на Polygon.',
  },
  fa: {
    ok: 'تایید',
    info: 'اطلاع',
    success: 'موفق',
    warning: 'هشدار',
    error: 'خطا',
    walletRequiredTitle: 'کیف پول لازم است',
    walletRequiredPreviewMessage: 'پیش از به‌روزرسانی پیش‌نمایش، کیف پول Polygon را متصل کنید.',
    walletRequiredOrderMessage: 'پیش از ثبت سفارش، کیف پول Polygon را متصل کنید.',
    walletRequiredNodeMessage: 'پیش از درخواست نود، کیف پول Polygon را متصل کنید.',
    wrongNetworkTitle: 'شبکه اشتباه است',
    wrongNetworkOrderMessage: 'پیش از ثبت سفارش، شبکه کیف پول را به Polygon تغییر دهید.',
    wrongNetworkNodeMessage: 'پیش از درخواست نود، شبکه کیف پول را به Polygon تغییر دهید.',
    invalidAmountTitle: 'مبلغ نامعتبر است',
    invalidAmountMessage: 'مبلغ مشارکت باید بین 1 تا 1000 باشد.',
    orderStateUnavailableTitle: 'وضعیت سفارش در دسترس نیست',
    orderStateUnavailableMessage: 'در حال حاضر دریافت وضعیت سفارش‌های زنجیره‌ای ممکن نیست. کمی بعد دوباره تلاش کنید.',
    actionCompletedTitle: 'عملیات انجام شد',
    actionFailedTitle: 'عملیات ناموفق بود',
    previewRefreshedMessage: 'پیش‌نمایش پس از امضای محلی به‌روزرسانی شد.',
    preparationStillInsufficient: 'تراکنش آماده‌سازی تأیید شد، اما سقف کیف پول هنوز کافی نیست.',
    recentWalletOrders: 'سفارش‌های اخیر کیف پول',
    noRouteOrdersForWallet: 'هنوز هیچ سفارش مسیری برای این کیف پول ثبت نشده است.',
    connectWalletToReadOrders: 'برای مشاهده سفارش‌های زنجیره‌ای کیف پول را متصل کنید.',
    amount: 'مبلغ',
    cycle: 'چرخه',
    pending: 'در انتظار',
    withdraw: 'برداشت',
    withdrawing: 'در حال برداشت...',
    nodeStateUnavailableTitle: 'وضعیت نود در دسترس نیست',
    nodeStateUnavailableMessage: 'در حال حاضر دریافت وضعیت نود ممکن نیست. کمی بعد دوباره تلاش کنید.',
    nodeAlreadyActiveTitle: 'نود از قبل فعال است',
    nodeAlreadyActiveMessage: 'این کیف پول از قبل دارای وضعیت فعال نود است.',
    nodeThresholdNotReachedTitle: 'آستانه نود تکمیل نشده است',
    nodeThresholdNotReachedMessage:
      'مشارکت تجمعی فعلی شما {current} است.\nبرای فعال‌سازی نود به {threshold} نیاز دارید.\nهنوز {remaining} مشارکت تجمعی دیگر لازم است.',
    walletSnapshotUnavailableTitle: 'نمای کلی کیف پول در دسترس نیست',
    walletSnapshotUnavailableMessage: 'در حال حاضر دریافت نمای کلی کیف پول ممکن نیست. کمی بعد دوباره تلاش کنید.',
    walletSnapshot: 'نمای کیف پول',
    walletNodeThreshold: 'آستانه نود کیف پول',
    walletAccumulated: 'مشارکت تجمعی کیف پول',
    remainingToNode: 'باقی‌مانده تا نود',
    walletNodeStatus: 'وضعیت نود کیف پول',
    activeShares: 'سهم‌های فعال',
    currentLevel: 'سطح فعلی',
    routeOrders: 'سفارش‌های مسیر',
    nodeOrderIncome: 'درآمد سفارش نود',
    nodeMarketIncome: 'درآمد بازار نود',
    active: 'فعال',
    notYet: 'هنوز خیر',
    activeNode: 'نود فعال',
    notNode: 'هنوز نود نیست',
    switchPolygon: 'شبکه کیف پول را به Polygon تغییر دهید.',
  },
  ar: {
    ok: 'حسناً',
    info: 'معلومة',
    success: 'نجاح',
    warning: 'تنبيه',
    error: 'خطأ',
    walletRequiredTitle: 'المحفظة مطلوبة',
    walletRequiredPreviewMessage: 'قم بربط محفظة Polygon قبل تحديث المعاينة.',
    walletRequiredOrderMessage: 'قم بربط محفظة Polygon قبل إرسال الطلب.',
    walletRequiredNodeMessage: 'قم بربط محفظة Polygon قبل طلب تفعيل العقدة.',
    wrongNetworkTitle: 'الشبكة غير صحيحة',
    wrongNetworkOrderMessage: 'حوّل شبكة المحفظة إلى Polygon قبل إرسال الطلب.',
    wrongNetworkNodeMessage: 'حوّل شبكة المحفظة إلى Polygon قبل طلب تفعيل العقدة.',
    invalidAmountTitle: 'المبلغ غير صالح',
    invalidAmountMessage: 'يجب أن يبقى مبلغ الاشتراك بين 1 و 1000.',
    orderStateUnavailableTitle: 'حالة الطلب غير متاحة',
    orderStateUnavailableMessage: 'لا يمكن تحميل حالة الطلبات على السلسلة الآن. حاول مرة أخرى لاحقاً.',
    actionCompletedTitle: 'اكتملت العملية',
    actionFailedTitle: 'فشلت العملية',
    previewRefreshedMessage: 'تم تحديث المعاينة بعد التوقيع المحلي.',
    preparationStillInsufficient: 'تم تأكيد معاملة الإعداد لكن حد المحفظة ما زال غير كافٍ.',
    recentWalletOrders: 'أحدث طلبات المحفظة',
    noRouteOrdersForWallet: 'لا توجد طلبات مسار لهذه المحفظة حالياً.',
    connectWalletToReadOrders: 'قم بربط المحفظة لقراءة الطلبات على السلسلة.',
    amount: 'المبلغ',
    cycle: 'الدورة',
    pending: 'قيد الانتظار',
    withdraw: 'سحب',
    withdrawing: 'جارٍ السحب...',
    nodeStateUnavailableTitle: 'حالة العقدة غير متاحة',
    nodeStateUnavailableMessage: 'لا يمكن تحميل حالة العقدة الآن. حاول مرة أخرى لاحقاً.',
    nodeAlreadyActiveTitle: 'العقدة مفعلة بالفعل',
    nodeAlreadyActiveMessage: 'هذه المحفظة تملك بالفعل حالة عقدة نشطة.',
    nodeThresholdNotReachedTitle: 'لم يتم بلوغ حد العقدة',
    nodeThresholdNotReachedMessage:
      'مشاركتك التراكمية الحالية هي {current}.\nيتطلب تفعيل العقدة الوصول إلى {threshold}.\nما زلت بحاجة إلى {remaining} من المشاركة التراكمية قبل إرسال هذا الطلب.',
    walletSnapshotUnavailableTitle: 'لقطة المحفظة غير متاحة',
    walletSnapshotUnavailableMessage: 'لا يمكن تحميل لقطة المحفظة الآن. حاول مرة أخرى لاحقاً.',
    walletSnapshot: 'لقطة المحفظة',
    walletNodeThreshold: 'حد العقدة للمحفظة',
    walletAccumulated: 'المشاركة التراكمية',
    remainingToNode: 'المتبقي للعقدة',
    walletNodeStatus: 'حالة عقدة المحفظة',
    activeShares: 'الحصص النشطة',
    currentLevel: 'المستوى الحالي',
    routeOrders: 'طلبات المسار',
    nodeOrderIncome: 'دخل أوامر العقدة',
    nodeMarketIncome: 'دخل سوق العقدة',
    active: 'نشط',
    notYet: 'ليس بعد',
    activeNode: 'عقدة نشطة',
    notNode: 'ليست عقدة',
    switchPolygon: 'حوّل شبكة المحفظة إلى Polygon.',
  },
}

export function getUiText(locale: AppLocale, key: UiTextKey) {
  return uiTexts[locale][key]
}

export function formatUiText(locale: AppLocale, key: UiTextKey, values: Record<string, string>) {
  return uiTexts[locale][key].replace(/\{(\w+)\}/g, (_, token: string) => values[token] ?? '')
}
