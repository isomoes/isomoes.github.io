import React from 'react'

interface BilibiliVideoProps {
  bvid: string
  cid?: string
  page?: number
  width?: number
  height?: number
}

const BilibiliVideo: React.FC<BilibiliVideoProps> = ({
  bvid,
  cid,
  page = 1,
  width = 500,
  height = 375,
}) => {
  return (
    <iframe
      title={`Bilibili Video ${bvid} Page ${page}`}
      src={`//player.bilibili.com/player.html?bvid=${bvid}`}
      scrolling="no"
      frameBorder="no"
      allowFullScreen={true}
      width={width}
      height={height}
      style={{ maxWidth: '100%', border: 'none' }}
    />
  )
}

export default BilibiliVideo
