import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered: ' + swUrl)
      
      if (r) {
        // 1시간마다 업데이트 확인
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  // 새 버전이 감지되면 자동으로 업데이트
  useEffect(() => {
    if (needRefresh) {
      console.log('New version available, updating automatically...')
      updateServiceWorker(true)
    }
  }, [needRefresh, updateServiceWorker])

  // 아무것도 렌더링하지 않음
  return null
}