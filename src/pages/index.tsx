import * as React from 'react'
import { NextPage } from 'next'
import { ethers } from 'ethers'
import Learnpack from '../../Learnpack.json'
import {
  Button,
  Container,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import { useRouter } from 'next/router'

const learnpackAddress = process.env.NEXT_PUBLIC_LEARNPACK_ADDRESS

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
})

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

const IndexPage: NextPage = () => {
  const classes = useStyles()
  const router = useRouter()
  const [rows, setRows] = React.useState([])

  React.useEffect(() => {
    fetchBalances()
  }, [])

  async function requestAccount() {
    await global.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchBalances() {
    if (typeof global.ethereum !== 'undefined') {
      console.log(learnpackAddress)
      await requestAccount()
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
        setRows(
          balances.map((balance, index) => createData(TOKEN_NAMES[index], balance.toString()))
        )
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }

  const handleTransfer = () => {
    router.push('/transfer')
  }

  React.useEffect(() => {
    global.ethereum.on('accountsChanged', function (accounts) {
      fetchBalances()
    })
  }, [])

  return (
    <Container maxWidth='lg'>
      <h1>Balances of {global?.ethereum?.selectedAddress}</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align='right'>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='right'>{row.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={fetchBalances}>Refresh </Button>
      <Button onClick={handleTransfer}>Transfer</Button>
    </Container>
  )
}

export default IndexPage
