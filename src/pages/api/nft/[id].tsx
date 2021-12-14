import Jimp from 'jimp'
import { join } from 'path'
// import { ethers } from 'ethers'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

export default nc<NextApiRequest, NextApiResponse>().get(async (req, res) => {
  const id = req.query.id as string

  const image = await Jimp.read(join(__dirname, 'public', 'certificate.jpg'))
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  image.print(
    font,
    0,
    0,
    {
      text: 'Hello world!' + id,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    1300,
    765
  )

  const buffer = await image.getBufferAsync(Jimp.MIME_JPEG)
  res.setHeader('Content-Type', 'image/jpeg')
  res.send(buffer)
})
