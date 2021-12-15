import Jimp from 'jimp'
import { readFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const id = req.query.id as string

  const file = readFileSync('public/img/certificate-bg.png')
  const image = await Jimp.read(file)
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
  image.print(
    font,
    0,
    0,
    {
      text: 'Learnpack NFT',
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    842,
    566
  )
  image.print(
    fontSmall,
    0,
    32,
    {
      text: id,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    842,
    566
  )

  const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
  res.setHeader('Content-Type', 'image/jpeg')
  res.send(buffer)
})
