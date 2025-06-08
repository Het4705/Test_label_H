import { useEffect, useState } from "react"
import CarouselReelSlider from "./carousel-reel-slider"
import { getReels } from "@/lib/firestore"
import { toast } from "sonner"

export default function ReelShowcase() {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReels = async () => {
      try {
        debugger;
        const data = await getReels()
        setReels(data)
      } catch (error) {
        toast.error("Failed to load reels. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchReels()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-12">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Fashion Reels Carousel
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Discover our latest collection through interactive video reels
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading reels...</div>
        ) : (
          <CarouselReelSlider
            reels={reels}
            autoPlay={false}
            showControls={true}
            className="mb-6 md:mb-8"
          />
        )}

        <div className="text-center mt-6 md:mt-12 space-y-1 md:space-y-2">
          <p className="text-gray-500 text-xs md:text-sm">
            <span className="font-medium">Navigation:</span> Swipe, tap side reels,
            or use dots below
          </p>
          <p className="text-gray-500 text-xs md:text-sm">
            <span className="font-medium">Controls:</span> Play/pause, mute/unmute,
            like, and shop
          </p>
        </div>
      </div>
    </div>
  )
}
