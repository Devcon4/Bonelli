
export default async function bootstrap() {
    // console.log(CSS.customMedia.set('--dark-theme', 'light'))
    if (('paintWorklet' in CSS)) {
      console.log('Has paintWorklet!');
    } else {
      console.log('No paintWorklet!');
      await import('./css-paint-polyfill.js');
      document.body.style.setProperty('--noPaint', 'false');

    }
    // @ts-ignore I know what i'm doing!
    CSS.paintWorklet.addModule('paint/line.js');
    // @ts-ignore I know what i'm doing!
    CSS.paintWorklet.addModule('paint/box.js');
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