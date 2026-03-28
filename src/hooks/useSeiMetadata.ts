import { useState, useEffect, useMemo } from 'react'
import { parseSeiFromFile, findSeiAtTime } from '@/utils/seiDecoder'
import type { SeiMetadata, SeiFrame } from '@/types/sei'

interface UseSeiMetadataResult {
  currentSei: SeiMetadata | null
  isLoading: boolean
  hasSeiData: boolean
}

// Cache parsed results keyed by File reference.
// WeakMap so entries are GC'd when File objects are released.
const seiCache = new WeakMap<File, SeiFrame[] | null>()

export function useSeiMetadata(
  frontFile: File | undefined,
  currentTime: number
): UseSeiMetadataResult {
  const [timeline, setTimeline] = useState<SeiFrame[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!frontFile) {
      setTimeline(null)
      return
    }

    // Cache hit — no I/O, instant
    if (seiCache.has(frontFile)) {
      setTimeline(seiCache.get(frontFile)!)
      return
    }

    let cancelled = false
    setTimeline(null)

    // Short delay to let video elements start loading first
    const timerId = setTimeout(() => {
      if (cancelled) return
      setIsLoading(true)

      parseSeiFromFile(frontFile)
        .then((frames) => {
          const result = frames.length > 0 ? frames : null
          seiCache.set(frontFile, result)
          if (!cancelled) setTimeline(result)
        })
        .catch(() => {
          seiCache.set(frontFile, null)
          if (!cancelled) setTimeline(null)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timerId)
    }
  }, [frontFile])

  const currentSei = useMemo(
    () => timeline ? findSeiAtTime(timeline, currentTime) : null,
    [timeline, currentTime]
  )

  return {
    currentSei,
    isLoading,
    hasSeiData: timeline !== null && timeline.length > 0,
  }
}
