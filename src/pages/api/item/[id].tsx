import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const id = req.query.id

  res.json({
    id: id,
    name: 'LGT',
    description: 'Learnpack Token',
    image: 'https://croqueta.pw/img/coin.png'
  })
})
