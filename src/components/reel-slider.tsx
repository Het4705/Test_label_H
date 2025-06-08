"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Reel {
  id: string
  src: string
  title: string
  description: string
  price?: string
  thumbnail?: string
}

interface ReelSliderProps {
  reels: Reel[]
  autoPlay?: boolean
  showControls?: boolean
  className?: string
}

export default function ReelSlider({ reels, autoPlay = false, showControls = true, className = "" }: ReelSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

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
    }, 100)
  }

  // Navigate to next slide
  const nextSlide = () => {
    const nextIndex = currentIndex === reels.length - 1 ? 0 : currentIndex + 1
    goToSlide(nextIndex)
  }

  // Navigate to previous slide
  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? reels.length - 1 : currentIndex - 1
    goToSlide(prevIndex)
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      } else if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentIndex, isPlaying])

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
    <div className={`relative h-100 w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Main video container */}
      <div
        className="relative aspect-[9/16] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              index === currentIndex ? "translate-x-0" : index < currentIndex ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <video
              ref={setVideoRef(index)}
              src={reel.src}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              poster={reel.thumbnail}
            />

            {/* Video overlay with product info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg mb-1">{reel.title}</h3>
              <p className="text-white/80 text-sm mb-2">{reel.description}</p>
              {reel.price && <p className="text-white font-bold text-xl">{reel.price}</p>}
            </div>
          </div>
        ))}

        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Video controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 p-4 bg-black">
        {reels.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 bg-black/20 text-white px-2 py-1 rounded text-sm">
        {currentIndex + 1} / {reels.length}
      </div>
    </div>
  )
}
