import * as React from 'react'
import { NextPage } from 'next'
import { ethers } from 'ethers'
import Learnpack from '../../Learnpack.json'
import { Button, Container, Input, MenuItem, Select, CircularProgress } from '@material-ui/core'
import create from 'zustand'

const learnpackAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Localhost

function createData(name: string, balance: string) {
  return { name, balance }
}

const TOKEN_NAMES = [
  'CERTIFICATE_ID',
  'GOVERNANCE_TOKEN',
  'AUTHOR_TOKEN',
  'EARNINGS_TOKEN',
  'ANSWERING_TOKEN'
]

const useTransfer = create((set, get) => ({
  transfering: false,
  balances: [],

  fetchBalances: async () => {
    if (typeof global.ethereum !== 'undefined') {
      await get().requestAccount()
      const provider = new ethers.providers.Web3Provider(global.ethereum)
      const contract = new ethers.Contract(learnpackAddress, Learnpack.abi, provider)
      try {
        const balances = await Promise.all([
          contract.balanceOf(global.ethereum.selectedAddress, 1),
          contract.balanceOf(global.ethereum.selectedAddress, 2),
          contract.balanceOf(global.ethereum.selectedAddress, 3),
          contract.balanceOf(global.ethereum.selectedAddress, 4),
          contract.balanceOf(global.ethereum.selectedAddress, 5)
        ])
        set({
          balances: balances.map((balance, index) =>
            createData(TOKEN_NAMES[index], balance.toString())
          )
        })
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  },

  requestAccount: async () => {
    await global.ethereum.request({ method: 'eth_requestAccounts' })
  },

  transfer: async (address: string, tokenId: number, amount: number) => {
    if (typeof global.ethereum !== 'undefined') {
      try {
        await get().requestAccount()
        const provider = new ethers.providers.Web3Provider(global.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(learnpackAddress, Learnpack.abi, signer)
        set({ transfering: true })
        const transaction = await contract.safeTransferFrom(
          global.ethereum.selectedAddress,
          address,
          tokenId,
          amount,
          ethers.utils.arrayify(0)
        )
        await transaction.wait()
        set({ transfering: false })
        get().fetchBalances()
      } catch (err) {
        console.log('Error: ', err)
        set({ transfering: false })
      }
    }
  }
}))

const IndexPage: NextPage = () => {
  const [token, setToken] = React.useState(1)
  const [address, setAddress] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const transfer = useTransfer()

  React.useEffect(() => {
    transfer.fetchBalances()
  }, [])

  // call the smart contract, read the current greeting value

  React.useEffect(() => {
    global.ethereum.on('accountsChanged', function (accounts) {
      transfer.fetchBalances()
    })
  }, [])

  return (
    <Container maxWidth='lg'>
      <h1>Transfer Token from {global?.ethereum?.selectedAddress}</h1>
      <div>
        <Select value={token} onChange={event => setToken(event.target.value as number)}>
          {transfer.balances.map((row, index) => (
            <MenuItem key={row.name} value={index + 1}>
              {row.name} - {row.balance}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Input
          placeholder='Account Address'
          value={address}
          onChange={event => setAddress(event.target.value)}
        />
      </div>
      <div>
        <Input
          placeholder='Amount'
          value={amount}
          onChange={event => setAmount(event.target.value)}
        />
      </div>
      {transfer.transfering ? (
        <CircularProgress />
      ) : (
        <Button onClick={() => transfer.transfer(address, token, parseInt(amount))}>
          Transfer
        </Button>
      )}
    </Container>
  )
}

export default IndexPage
