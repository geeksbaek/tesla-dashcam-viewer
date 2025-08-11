/// <reference lib="webworker" />
import MP4Box from 'mp4box';

let encoder: VideoEncoder | null = null;
let mp4file: ReturnType<typeof MP4Box.createFile>;
let frameCounter = 0;
// let abortController = new AbortController();

self.onmessage = async (event: MessageEvent) => {
  const { type, params, bitmaps, mediaTime } = event.data;

  switch (type) {
    case 'start': {
      const { layout, width, height } = params;

      const V_WIDTH = width;
      const V_HEIGHT = height;
      const V_FPS = 30;
      const V_BITRATE = 2_000_000;

      const [cols, rows] = layout === '2x2' ? [2, 2] : [3, 2];

      const config: VideoEncoderConfig = {
        codec: 'hvc1.1.6.L123.B0', // HEVC codec
        width: cols * V_WIDTH,
        height: rows * V_HEIGHT,
        framerate: V_FPS,
        bitrate: V_BITRATE * 4, // Assume 4 cameras for now
        hardwareAcceleration: 'prefer-hardware' as const,
        latencyMode: 'realtime' as const,
      };

      let support = await VideoEncoder.isConfigSupported(config);
      let codecType = 'hevc';
      
      if (!support.supported) {
        // Fallback to H.264 if HEVC is not supported
        console.warn('HEVC not supported, trying H.264');
        config.codec = 'avc1.42001E';
        support = await VideoEncoder.isConfigSupported(config);
        codecType = 'avc';
        
        if (!support.supported) {
          self.postMessage({ type: 'error', message: 'Neither HEVC nor H.264 encoding is supported' });
          return;
        }
      }

      mp4file = MP4Box.createFile();
      const trackConfig: Record<string, unknown> = {
        width: config.width,
        height: config.height,
        timescale: 1_000_000,
        samplerate: V_FPS,
        codec: codecType === 'hevc' ? 'hvc1' : 'avc1'
      };
      
      if (codecType === 'hevc') {
        trackConfig.hvcDecoderConfigRecord = support.config?.description;
      } else {
        trackConfig.avcDecoderConfigRecord = support.config?.description;
      }
      
      const track_id = mp4file.addTrack(trackConfig);

      encoder = new VideoEncoder({
        output: (chunk) => {
          const buffer = new ArrayBuffer(chunk.byteLength);
          chunk.copyTo(buffer);
          const sample = {
            track_id,
            data: buffer,
            is_sync: chunk.type === 'key',
            cts: chunk.timestamp,
            dts: chunk.timestamp,
            duration: chunk.duration || 1_000_000 / V_FPS,
          };
          mp4file.addSample(track_id, sample.data, sample);
        },
        error: (e) => {
          self.postMessage({ type: 'error', message: e.message });
        },
      });
      encoder.configure(config);
      break;
    }
    case 'frame': {
      if (!encoder) return;
      const { layout, baseTimestamp, language, width, height, duration } = event.data.params || {};
      const V_WIDTH = width;
      const V_HEIGHT = height;
      const [cols, rows] = layout === '2x2' ? [2, 2] : [3, 2];
      const canvas = new OffscreenCanvas(cols * V_WIDTH, rows * V_HEIGHT);
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bitmaps.forEach((bitmap: ImageBitmap, i: number) => {
        const x = (i % cols) * V_WIDTH;
        const y = Math.floor(i / cols) * V_HEIGHT;
        ctx.drawImage(bitmap, x, y, V_WIDTH, V_HEIGHT);
        drawTimestamp(ctx, x, y, formatTimestamp(baseTimestamp, mediaTime, language));
      });

      const frame = new VideoFrame(canvas, { timestamp: mediaTime * 1_000_000 });
      encoder.encode(frame, { keyFrame: frameCounter % (30 * 2) === 0 });
      frame.close();
      frameCounter++;
      self.postMessage({ type: 'progress', progress: (mediaTime / duration) * 100 });
      break;
    }
    case 'end': {
      if (!encoder) return;
      await encoder.flush();
      const blob = new Blob([mp4file.getBuffer()], { type: 'video/mp4' });
      self.postMessage({ type: 'result', blob });
      break;
    }
    case 'cancel': {
        if(encoder) encoder.close();
        break;
    }
  }
};

function formatTimestamp(baseTimestamp: string, additionalSeconds: number = 0, language: string = 'en-US') {
  try {
    const parts = baseTimestamp.split('_');
    if (parts.length !== 2) return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':');
    const datePart = parts[0];
    const timePart = parts[1];
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split('-').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds + Math.floor(additionalSeconds);
    const newHours = Math.floor(totalSeconds / 3600) % 24;
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSecs = totalSeconds % 60;
    const date = new Date(year, month - 1, day, newHours, newMinutes, newSecs);
    const formatter = new Intl.DateTimeFormat(language, { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    return baseTimestamp.replace(/_/g, ' ').replace(/-/g, ':');
  }
}

function drawTimestamp(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, text: string) {
  const fontSize = 20;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  const textMetrics = ctx.measureText(text);
  ctx.fillRect(x + 10, y + 10, textMetrics.width + 20, fontSize + 10);
  ctx.fillStyle = 'white';
  ctx.fillText(text, x + 20, y + 30);
}