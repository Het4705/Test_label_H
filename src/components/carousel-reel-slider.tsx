"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Reel } from "@/types"


interface CarouselReelSliderProps {
  reels: Reel[]
  autoPlay?: boolean
  showControls?: boolean
  className?: string
}

export default function CarouselReelSlider({
  reels,
  autoPlay = false,
  showControls = true,
  className = "",
}: CarouselReelSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const navigate = useNavigate();

  // Get the reels to display (previous, current, next)
  const getVisibleReels = () => {
    const prevIndex = currentIndex === 0 ? reels.length - 1 : currentIndex - 1
    const nextIndex = currentIndex === reels.length - 1 ? 0 : currentIndex + 1

    return {
      prev: reels[prevIndex],
      current: reels[currentIndex],
      next: reels[nextIndex],
      prevIndex,
      nextIndex,
    }
  }

  const { prev, current, next, prevIndex, nextIndex } = getVisibleReels()

  // Handle video play/pause
  const togglePlay = () => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause()
      } else {
        currentVideo.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      currentVideo.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    // Pause current video
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      currentVideo.pause()
    }

    setCurrentIndex(index)
    setIsPlaying(false)

    // Auto-play new video if autoPlay is enabled
    setTimeout(() => {
      const newVideo = videoRefs.current[index]
      if (newVideo && autoPlay) {
        newVideo.play()
        setIsPlaying(true)
      }
    }, 300)
  }

  // Navigate to next slide
  const nextSlide = () => {
    const nextIdx = currentIndex === reels.length - 1 ? 0 : currentIndex + 1
    goToSlide(nextIdx)
  }

  // Navigate to previous slide
  const prevSlide = () => {
    const prevIdx = currentIndex === 0 ? reels.length - 1 : currentIndex - 1
    goToSlide(prevIdx)
  }

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Set video refs
  const setVideoRef = (index: number) => (ref: HTMLVideoElement | null) => {
    videoRefs.current[index] = ref
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No reels available</p>
      </div>
    )
  }

  return (
    <div className={`relative w-full max-w-6xl mx-auto ${className}`}>
      {/* Main carousel container */}
      <div
        className="relative h-[500px] md:h-[600px] flex items-center justify-center gap-2 md:gap-4 px-2 md:px-4"
        onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous reel (left side) */}
        <div
          className="relative w-24 sm:w-32 md:w-48 h-48 sm:h-64 md:h-80 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 opacity-70 hover:opacity-90"
          onClick={() => goToSlide(prevIndex)}
        >
          <video src={prev.src} className="w-full h-full object-cover" muted loop poster={prev.thumbnail} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3">
            <p className="text-white text-xs md:text-sm font-medium truncate">{prev.title}</p>
            {prev.price && <p className="text-white text-xs hidden sm:block">{prev.price}</p>}
          </div>
        </div>

        {/* Current reel (center) */}
        <div className="relative h-[95%] 
         w-96 rounded-2xl md:rounded-3xl shadow-fuchsia-700/30
          overflow-hidden shadow-2xl transform transition-all 
          duration-300 z-10">
          <video
            ref={setVideoRef(currentIndex)}
            src={current.src}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster={current.thumbnail}
          />

          {/* Video controls overlay */}
          {showControls && (
            <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 bg-black/30 hover:bg-black/50 text-white border-0 backdrop-blur-sm"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10 bg-black/30 hover:bg-black/50 text-white border-0 backdrop-blur-sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Volume2 className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 md:h-10 md:w-10 bg-black/30 hover:bg-black/50 border-0 backdrop-blur-sm transition-colors ${
                isLiked ? "text-red-500" : "text-white"
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-3 w-3 md:h-4 md:w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Product information overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 md:p-6">
            <h3 className="text-white font-bold text-sm sm:text-lg md:text-xl mb-1 md:mb-2">{current.title}</h3>
            <p className="text-white/90 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 hidden sm:block">
              {current.description.slice(0, 100)}{current.description.length > 100 ? "..." : ""}
            </p>
            {current.price && (
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-base sm:text-xl md:text-2xl">{current.price}</p>
                <Button size="sm" className="text-xs md:text-sm h-8 bg-white text-black hover:bg-white/90" onClick={()=>navigate(`/product/${current.productId}`)}>
                  Shop Now <ShoppingCart className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Next reel (right side) */}
        <div
          className="relative w-24 sm:w-32 md:w-48 h-48 sm:h-64 md:h-80 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 opacity-70 hover:opacity-90"
          onClick={() => goToSlide(nextIndex)}
        >
          <video src={next.src} className="w-full h-full object-cover" muted loop poster={next.thumbnail} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3">
            <p className="text-white text-xs md:text-sm font-medium truncate">{next.title}</p>
            {next.price && <p className="text-white text-xs hidden sm:block">{next.price}</p>}
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
        {reels.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              index === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Slide counter
      <div className="absolute top-2  md:top-4 left-1/2 transform -translate-x-1/2 bg-black/20 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm backdrop-blur-sm">
        {currentIndex + 1} of {reels.length}
      </div> */}
    </div>
  )
}
