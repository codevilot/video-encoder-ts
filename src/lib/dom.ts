const FPS = 30;
class DOM {
  private video: HTMLVideoElement | undefined;
  private processedVideo: HTMLVideoElement | undefined;
  private canvas: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D | undefined;
  constructor() {
    this.video;
    this.processedVideo;
    this.canvas;
    this.context;
  }
  public id(id: string) {
    return document.getElementById(id);
  }
  public get Video() {
    if (!this.video)
      this.video = document.getElementById(
        'original-video'
      ) as HTMLVideoElement;
    return this.video;
  }
  public get ProcessedVideo() {
    if (!this.processedVideo)
      this.processedVideo = document.getElementById(
        'processed-video'
      ) as HTMLVideoElement;
    return this.processedVideo;
  }
  public get Canvas() {
    if (!this.canvas) this.canvas = document.createElement('canvas');
    return this.canvas;
  }
  private resizeCanvas() {
    this.Canvas.width = this.Video.videoWidth;
    this.Canvas.height = this.Video.videoHeight;
  }
  public async setCanvas(file: File) {
    return new Promise((resolve) => {
      this.Video.src = URL.createObjectURL(file);
      this.Video.onloadeddata = () => {
        this.resizeCanvas();
        resolve(this.Canvas);
      };
    });
  }
  public get ctx() {
    if (!this.context) this.context = this.Canvas.getContext('2d');
    return this.context;
  }
  public drawVideo() {
    this.ctx.drawImage(this.Video, 0, 0, this.Canvas.width, this.Canvas.height);
  }
  public nextFrame(FPS: number) {
    this.Video.currentTime += 1 / FPS;
    return new Promise((res) => {
      dom.Video.onseeked = () => {
        res(this.drawVideo());
      };
    });
  }
  public getFrame() {
    return this.ctx.getImageData(0, 0, this.Canvas.width, this.Canvas.height);
  }
  public async exportFrames() {
    let timeStamp = 0;
    const frames: ImageData[] = [];

    while (timeStamp < dom.Video.duration) {
      await dom.nextFrame(FPS);
      timeStamp += 1 / FPS;
      const frame = dom.getFrame();
      frames.push(frame);
    }
    return frames;
  }
}

export const dom = new DOM();
