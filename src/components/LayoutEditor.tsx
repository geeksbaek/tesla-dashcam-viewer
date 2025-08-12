import React, { useState, useEffect } from 'react'
import { Modal, SegmentedControl, Button, Group, Stack, Text, Box } from '@mantine/core'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter
} from '@dnd-kit/core'
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { 
  IconRefresh, 
  IconDeviceFloppy,
  IconArrowUp,
  IconArrowDown,
  IconArrowUpLeft,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconArrowDownRight
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import type {
  CameraType,
  LayoutMode,
  LayoutConfig,
  LayoutPosition
} from '@/types/layout'
import {
  DEFAULT_LAYOUTS,
  CAMERA_LABELS
} from '@/types/layout'
import { saveLayoutConfig, loadLayoutConfig, resetLayoutConfig } from '@/utils/layoutStorage'

interface VideoFile {
  timestamp: string
  front?: File
  back?: File
  left_repeater?: File
  right_repeater?: File
  left_pillar?: File
  right_pillar?: File
}

interface LayoutEditorProps {
  opened: boolean
  onClose: () => void
  videoFiles: VideoFile[]
  onLayoutChange?: (config: LayoutConfig) => void
}

interface GridCellProps {
  position: LayoutPosition
  index: number
  isOver?: boolean
  isDragging?: boolean
  isSwapping?: boolean
  onDrop: (camera: CameraType | null) => void
}

const getCameraIcon = (camera: CameraType) => {
  const icons: Record<CameraType, React.ReactNode> = {
    front: <IconArrowUp size={24} />,
    back: <IconArrowDown size={24} />,
    left_repeater: <IconArrowDownLeft size={24} />,
    right_repeater: <IconArrowDownRight size={24} />,
    left_pillar: <IconArrowUpLeft size={24} />,
    right_pillar: <IconArrowUpRight size={24} />
  }
  return icons[camera] || <IconArrowUp size={24} />
}

const GridCell: React.FC<GridCellProps> = ({ position, index, isOver, isDragging, isSwapping, onDrop }) => {
  const { t } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (isSwapping) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isSwapping])
  
  const getCameraLabel = (camera: CameraType) => {
    const labels: Record<CameraType, string> = {
      front: t('camera.front'),
      back: t('camera.back'),
      left_repeater: t('camera.leftRepeater'),
      right_repeater: t('camera.rightRepeater'),
      left_pillar: t('camera.leftPillar'),
      right_pillar: t('camera.rightPillar')
    }
    return labels[camera] || CAMERA_LABELS[camera]
  }

  // B필러는 항상 사용 가능한 것으로 표시
  // const isAvailable = position.camera ? 
  //   (position.camera === 'left_pillar' || position.camera === 'right_pillar' ? true : availableCameras.has(position.camera)) 
  //   : true
  
  return (
    <Box
      id={`cell-${index}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: isOver ? 'rgba(34, 139, 230, 0.2)' : 'rgba(255, 255, 255, 0.03)',
        border: `2px ${isOver ? 'solid' : 'dashed'} ${isOver ? '#228be6' : 'rgba(255, 255, 255, 0.2)'}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isOver ? 'scale(1.05)' : isAnimating ? 'scale(0.95)' : 'scale(1)',
        cursor: 'grab',
        opacity: isDragging ? 0.3 : 1,
        position: 'relative',
        boxShadow: isOver ? '0 0 20px rgba(34, 139, 230, 0.4)' : 'none'
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const camera = e.dataTransfer.getData('camera') as CameraType
        if (camera) {
          onDrop(camera)
        }
      }}
    >
      {position.camera ? (
        <Box
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('camera', position.camera!)
            e.dataTransfer.setData('sourceIndex', index.toString())
            e.dataTransfer.effectAllowed = 'move'
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(34, 139, 230, 0.15)',
            borderRadius: '6px',
            cursor: isDragging ? 'grabbing' : 'move',
            userSelect: 'none',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isDragging ? 'scale(0.9)' : isAnimating ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          <Box style={{ 
            color: '#4dabf7',
            marginBottom: '8px',
            transition: 'all 0.3s ease',
            transform: isDragging ? 'scale(1.2)' : isAnimating ? 'scale(0.9)' : 'scale(1)',
            filter: isDragging ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
          }}>
            {getCameraIcon(position.camera)}
          </Box>
          <Text size="sm" fw={600} style={{ 
            color: '#fff',
            transition: 'all 0.3s ease',
            opacity: isDragging ? 0.6 : 1
          }}>
            {getCameraLabel(position.camera)}
          </Text>
        </Box>
      ) : (
        <Box style={{ 
          textAlign: 'center',
          transition: 'all 0.3s ease',
          transform: isOver ? 'scale(1.1)' : 'scale(1)'
        }}>
          <Box style={{ 
            color: isOver ? 'rgba(34, 139, 230, 0.8)' : 'rgba(255, 255, 255, 0.3)',
            marginBottom: '8px',
            transition: 'all 0.3s ease'
          }}>
            {isOver ? <IconArrowDown size={32} /> : null}
          </Box>
          <Text size="sm" c={isOver ? 'blue' : 'dimmed'} fw={isOver ? 600 : 400}>
            {t('layout.dropHere')}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  opened,
  onClose,
  videoFiles,
  onLayoutChange
}) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<LayoutMode>('2x2')
  const [config, setConfig] = useState<LayoutConfig>(DEFAULT_LAYOUTS['2x2'])
  const [isDirty, setIsDirty] = useState(false)
  const [draggedCamera, setDraggedCamera] = useState<CameraType | null>(null)
  const [dragOverId, setDragOverId] = useState<UniqueIdentifier | null>(null)
  const [swappingIndices, setSwappingIndices] = useState<number[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const availableCameras = new Set<CameraType>()
  if (videoFiles.length > 0) {
    const currentVideo = videoFiles[0]
    if (currentVideo.front) availableCameras.add('front')
    if (currentVideo.back) availableCameras.add('back')
    if (currentVideo.left_repeater) availableCameras.add('left_repeater')
    if (currentVideo.right_repeater) availableCameras.add('right_repeater')
    if (currentVideo.left_pillar) availableCameras.add('left_pillar')
    if (currentVideo.right_pillar) availableCameras.add('right_pillar')
  }

  useEffect(() => {
    if (opened) {
      const loadedConfig = loadLayoutConfig(mode)
      setConfig(loadedConfig)
      setIsDirty(false)
    }
  }, [opened, mode])

  const handleModeChange = (newMode: string) => {
    setMode(newMode as LayoutMode)
    const loadedConfig = loadLayoutConfig(newMode as LayoutMode)
    setConfig(loadedConfig)
    setIsDirty(false)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setDraggedCamera(active.id as CameraType)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setDragOverId(over ? over.id : null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setDraggedCamera(null)
      setDragOverId(null)
      return
    }

    const draggedCamera = active.id as CameraType
    const targetIndex = parseInt(over.id as string)
    
    // 애니메이션 트리거
    const sourceIndex = config.positions.findIndex(p => p.camera === draggedCamera)
    if (sourceIndex !== -1 && sourceIndex !== targetIndex) {
      setSwappingIndices([sourceIndex, targetIndex])
      setTimeout(() => setSwappingIndices([]), 400)
    }
    
    const newPositions = [...config.positions]
    
    if (sourceIndex !== -1) {
      newPositions[sourceIndex] = { ...newPositions[sourceIndex], camera: null }
    }
    
    const existingCamera = newPositions[targetIndex].camera
    if (existingCamera && sourceIndex !== -1) {
      newPositions[sourceIndex] = { ...newPositions[sourceIndex], camera: existingCamera }
    }
    
    newPositions[targetIndex] = { ...newPositions[targetIndex], camera: draggedCamera }
    
    const newConfig = { ...config, positions: newPositions }
    setConfig(newConfig)
    setIsDirty(true)
    setDraggedCamera(null)
    setDragOverId(null)
  }

  const handleCellDrop = (index: number, camera: CameraType | null) => {
    const newPositions = [...config.positions]
    
    if (camera) {
      const sourceIndex = newPositions.findIndex(p => p.camera === camera)
      if (sourceIndex !== -1 && sourceIndex !== index) {
        // 애니메이션 트리거
        setSwappingIndices([sourceIndex, index])
        setTimeout(() => setSwappingIndices([]), 400)
        
        const targetCamera = newPositions[index].camera
        newPositions[sourceIndex] = { ...newPositions[sourceIndex], camera: targetCamera }
      }
    }
    
    newPositions[index] = { ...newPositions[index], camera }
    
    const newConfig = { ...config, positions: newPositions }
    setConfig(newConfig)
    setIsDirty(true)
  }

  const handleSave = () => {
    saveLayoutConfig(config)
    onLayoutChange?.(config)
    setIsDirty(false)
    onClose()
  }

  const handleReset = () => {
    const defaultConfig = DEFAULT_LAYOUTS[mode]
    setConfig(defaultConfig)
    resetLayoutConfig(mode)
    onLayoutChange?.(defaultConfig)
    setIsDirty(false)
  }

  const getCameraLabel = (camera: CameraType) => {
    const labels: Record<CameraType, string> = {
      front: t('camera.front'),
      back: t('camera.back'),
      left_repeater: t('camera.leftRepeater'),
      right_repeater: t('camera.rightRepeater'),
      left_pillar: t('camera.leftPillar'),
      right_pillar: t('camera.rightPillar')
    }
    return labels[camera] || CAMERA_LABELS[camera]
  }

  const renderGrid = () => {
    const cols = mode === '3x2' ? 3 : 2
    const rows = 2
    
    // 고정된 컨테이너와 셀 크기
    const GAP = 12
    const PADDING = 16
    const CELL_WIDTH = 168
    const CELL_HEIGHT = 94
    
    // 3x2와 2x2 모두 동일한 컨테이너 크기 유지
    const CONTAINER_WIDTH = (CELL_WIDTH * 3) + (GAP * 2) + (PADDING * 2)
    const CONTAINER_HEIGHT = (CELL_HEIGHT * 2) + GAP + (PADDING * 2)
    
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${CELL_WIDTH}px)`,
            gridTemplateRows: `repeat(${rows}, ${CELL_HEIGHT}px)`,
            gap: `${GAP}px`,
            padding: `${PADDING}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            width: `${CONTAINER_WIDTH}px`,
            height: `${CONTAINER_HEIGHT}px`,
            margin: '0 auto',
            justifyContent: 'center',
            alignContent: 'center'
          }}
        >
          {config.positions.map((position, index) => (
            <Box
              key={`${position.row}-${position.col}`}
              id={index.toString()}
              style={{
                width: `${CELL_WIDTH}px`,
                height: `${CELL_HEIGHT}px`,
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: swappingIndices.includes(index) ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <GridCell
                position={position}
                index={index}
                isDragging={draggedCamera === position.camera}
                isOver={dragOverId === index.toString()}
                isSwapping={swappingIndices.includes(index)}
                onDrop={(camera) => handleCellDrop(index, camera)}
              />
            </Box>
          ))}
        </Box>
        <DragOverlay>
          {draggedCamera && (
            <Box
              style={{
                width: '150px',
                height: '84px',
                backgroundColor: 'rgba(34, 139, 230, 0.4)',
                border: '2px solid #228be6',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transform: 'scale(1.1)',
                animation: 'float 1s ease-in-out infinite'
              }}
            >
              <Box style={{ 
                color: '#4dabf7', 
                marginBottom: '4px',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                {getCameraIcon(draggedCamera)}
              </Box>
              <Text size="xs" fw={600} c="white">
                {getCameraLabel(draggedCamera)}
              </Text>
            </Box>
          )}
        </DragOverlay>
      </DndContext>
    )
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: scale(1.1) translateY(0px); }
          50% { transform: scale(1.1) translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
      <Modal
        opened={opened}
        onClose={onClose}
        title={t('layout.title')}
        size="xl"
        centered
      >
        <Stack>
          <SegmentedControl
            value={mode}
            onChange={handleModeChange}
            data={[
              { label: '2x2 (HW3)', value: '2x2' },
              { label: '3x2 (HW4)', value: '3x2' }
            ]}
            fullWidth
          />
          
          <Text size="sm" c="dimmed">
            {t('layout.instructions')}
          </Text>
          
          {renderGrid()}
          
          <Group justify="space-between">
            <Button
              variant="default"
              leftSection={<IconRefresh size={16} />}
              onClick={handleReset}
            >
              {t('layout.reset')}
            </Button>
            
            <Group gap={8}>
              <Button variant="default" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSave}
                disabled={!isDirty}
              >
                {t('common.save')}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}