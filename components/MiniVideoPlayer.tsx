"use client"

import { useState, useRef } from "react"

export default function MiniVideoPlayer({
  src,
  title = "Xem video",
}: {
  src: string
  title?: string
}) {
  const [open, setOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const toggleVideo = () => {
    if (!open) {
      setOpen(true)

      // chờ render rồi play
      setTimeout(() => {
        videoRef.current?.play()
      }, 100)
    } else {
      videoRef.current?.pause()
      setOpen(false)
    }
  }

  return (
    <div className="my-10 w-full">

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={toggleVideo}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          ▶ {title}
        </button>
      </div>

      {/* Video */}
      {open && (
        <div className="mt-6 w-full aspect-video">
          <video
            ref={videoRef}
            controls
            preload="none"
            className="w-full h-full rounded-xl shadow-lg"
            src={src}
          />
        </div>
      )}
    </div>
  )
}