import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const info = {
  '1': {
    id: '1',
    name: 'Learnpack NFT',
    description: 'Learnpack NFT of competence',
    image: 'https://croqueta.pw/api/nft/LearnpackNFT'
  },
  '2': {
    id: '2',
    name: 'LGTO',
    description: 'Learnpack Governance Token',
    image: 'https://croqueta.pw/img/lgto.png'
  },
  '3': {
    id: '3',
    name: 'LATO',
    description: 'Learnpack Author Token',
    image: 'https://croqueta.pw/img/lato.png'
  },
  '4': {
    id: '4',
    name: 'LET',
    description: 'Learnpack Earnings Token',
    image: 'https://croqueta.pw/img/let.png'
  },
  '5': {
    id: '5',
    name: 'LAT',
    description: 'Learnpack Answering Token',
    image: 'https://croqueta.pw/img/lat.png'
  }
}

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const id = req.query.id as string

  if (id in info) {
    res.json(info[id])
  } else {
    res.status(404).json({
      error: 'Not found'
    })
  }
})
