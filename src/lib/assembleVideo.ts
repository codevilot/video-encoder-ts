import { dom } from './dom';

async function assembleVideoFromFrames(
  decodedFrames: ImageData[],
  fps: number = 30
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx)
      return reject(new Error('Canvas 2D context를 생성할 수 없습니다.'));

    canvas.width = decodedFrames[0].width;
    canvas.height = decodedFrames[0].height;

    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.start();

    let frameIndex = 0;
    function drawNextFrame() {
      if (frameIndex < decodedFrames.length) {
        ctx.putImageData(decodedFrames[frameIndex], 0, 0);
        frameIndex++;
        setTimeout(drawNextFrame, 1000 / fps);
      } else {
        mediaRecorder.stop();
      }
    }

    drawNextFrame();
  });
}
export async function createVideoFromDecodedFrames(decodedFrames: ImageData[]) {
  try {
    const videoBlob = await assembleVideoFromFrames(decodedFrames, 30); // 30 FPS로 설정
    const processedVideo = dom.ProcessedVideo;
    processedVideo.src = URL.createObjectURL(videoBlob);

    console.log('비디오 재구성이 완료되었습니다.');
  } catch (error) {
    console.error('비디오 재구성 중 오류 발생:', error);
  }
}