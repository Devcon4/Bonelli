
export default async function bootstrap() {
    console.log(CSS.customMedia);
    // console.log(CSS.customMedia.set('--dark-theme', 'light'))
    if (('paintWorklet' in CSS)) {
      console.log('Has paintWorklet!');
      // @ts-ignore I know what i'm doing!
      CSS.paintWorklet.addModule('paint/linePattern.js');

    } else {
      console.log('No paintWorklet!');
      document.body.style.setProperty('--hasPaint', 'false');
    }
    if ('registerProperty' in CSS) {
      // @ts-ignore Don't tell me what to do!
      // CSS.registerProperty({
      //   name: '--cloud-nudge',
      //   syntax: '*',
      //   inherits: false
      // });
      // // @ts-ignore.
      // CSS.registerProperty({
      //   name: '--spline-points',
      //   syntax: '*',
      //   inherits: false
      // });
    }
  }