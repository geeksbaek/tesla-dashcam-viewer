/// <reference lib="webworker" />

self.onmessage = async (event: MessageEvent) => {
  const { type, frame } = event.data;

  switch (type) {
    case 'init': {
      // Initialize message if needed
      self.postMessage({ type: 'ready' });
      break;
    }
    
    case 'frame': {
      // Process frame - just pass through for now
      // In the main thread, we'll handle the actual encoding
      self.postMessage({ type: 'frame-processed', frame });
      break;
    }
    
    case 'complete': {
      self.postMessage({ type: 'complete' });
      break;
    }
  }
};