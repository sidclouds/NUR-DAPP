# NUR DApp

`apps/dapps/05` is the current production-facing NUR user DApp.

It no longer uses local mock data. The runtime split is:
- public display data comes from `server`
- wallet connection uses `RainbowKit + wagmi`
- write actions go directly to Polygon contracts

## Stack

- React + Vite
- RainbowKit
- wagmi
- viem

## What Is Live

### Public data from `server`

- `GET /api/public/dashboard`
- `GET /api/public/cycles`
- `GET /api/public/community`
- `GET /api/public/nodes`
- `GET /api/public/token`
- `POST /api/public/orders/preview`

### Contract actions from wallet

- `approve(USDT -> NURStake)`
- `stakeWithInviter(amount, minAmountOut, inviter)`
- `unstake(index)`
- `becomeNode()`

### Contract reads from wallet

- settlement token `symbol`, `decimals`, `balanceOf`, `allowance`
- NUR `balanceOf`
- `ordersLength(address)`
- `getOrder(address, index)`
- `shareBalance(address)`
- `accin(address)`
- `getLevel(address)`
- `isNode(address)`
- node income totals

## Environment

Create `apps/dapps/05/.env` from `.env.example`.

Required values:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
VITE_NUR_TOKEN_ADDRESS=0x...
VITE_NUR_STAKE_ADDRESS=0x...
VITE_NUR_NODE_ADDRESS=0x...
VITE_SETTLEMENT_TOKEN_ADDRESS=0x3c499c542cef5e3811e1192ce70d8cc03d5c3359
```

## Run

```bash
cd apps/dapps/05
npm install
npm run dev
```

Build:

```bash
npm run build
```

## User Flow

1. Connect a Polygon wallet.
2. Enter subscription amount on the Routes page.
3. Approve USDT for `NURStake`.
4. Submit `stakeWithInviter`.
5. Wait for treasury to execute `confirmOrders`.
6. Read route status and balances directly from chain.
7. If accumulated input reaches node threshold, call `becomeNode()`.
8. When an order matures, call `unstake(index)`.

## Notes

- This app expects a running `server` and deployed Polygon contracts.
- If backend or contract addresses are missing, the page will now fail instead of falling back to demo data.
- Wallet signing is always done client-side. The DApp does not custody private keys.
