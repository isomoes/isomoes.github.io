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
  page = 1,
  width = '80%',
  height = 375,
}) => {
  return (
    <div className="flex  items-center justify-center">
      <iframe
        title={`Bilibili Video ${bvid}`}
        src={`//player.bilibili.com/player.html?bvid=${bvid}&autoplay=0`}
        scrolling="no"
        frameBorder="no"
        allowFullScreen={true}
        width={width}
        height={height}
        style={{ maxWidth: '100%', border: 'none' }}
      />
    </div>
  )
}

export default BilibiliVideo
