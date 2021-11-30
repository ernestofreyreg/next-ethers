import * as React from 'react'
import { NextPage } from 'next'
import { ethers } from 'ethers'
import Greeter from '../../Greeter.json'
import { Container } from '@material-ui/core'

// const greeterAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3' // Localhost
const greeterAddress = '0xf6E539427817335f87f16E42c05505E3AEB8047f' // Ropsten

const IndexPage: NextPage = () => {
  const [greeting, setGreetingValue] = React.useState('')

  // request access to the user's MetaMask account
  async function requestAccount() {
    await global.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof global.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(global.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
        alert(data)
      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof global.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(global.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <Container maxWidth='lg'>
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <button onClick={setGreeting}>Set Greeting</button>
      <input
        value={greeting}
        onChange={e => setGreetingValue(e.target.value)}
        placeholder='Set greeting'
      />
    </Container>
  )
}

export default IndexPage
