import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button, Modal, Text, Group } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered: ' + swUrl)
      
      if (r) {
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <>
      <Modal
        opened={offlineReady && !needRefresh}
        onClose={close}
        title="오프라인 사용 가능"
        centered
      >
        <Text size="sm" mb="md">
          앱이 오프라인에서 사용 가능하도록 준비되었습니다.
        </Text>
        <Group justify="flex-end">
          <Button onClick={close} variant="subtle">
            확인
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={needRefresh}
        onClose={() => {}}
        withCloseButton={false}
        title="새 버전 사용 가능"
        centered
      >
        <Text size="sm" mb="md">
          새로운 버전이 사용 가능합니다. 지금 업데이트하시겠습니까?
        </Text>
        <Group justify="flex-end">
          <Button onClick={close} variant="subtle" color="gray">
            나중에
          </Button>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={() => updateServiceWorker(true)}
          >
            업데이트
          </Button>
        </Group>
      </Modal>
    </>
  )
}