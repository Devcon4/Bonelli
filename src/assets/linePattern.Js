console.log('loadding paint!');

class linePainter {
    static get inputProperties() { return ['--line-count', '--LightShade', '--LightAccent', '--Main', '--DarkAccent', '--DarkShade', '--line-color-dark-shade', '--line-swaps', '--animation-tick']; }
    paint(ctx, geo, properties) {

        console.log('paint!');
        console.log(ctx);
        console.log(geo);
        console.log(properties);
        
        const lightShade = (properties.get('--LightShade').toString());
        const lightAccent = (properties.get('--LightAccent').toString());
        const main = (properties.get('--Main').toString());
        const darkAccent = (properties.get('--DarkAccent').toString());
        const darkShade = (properties.get('--DarkShade').toString());
        
        const lineSwaps = (properties.get('--line-swaps').toString().split(',').map(v => +v.replace('"', '')));

        console.log(lightShade);
        console.log(lineSwaps);
        ctx.fillStyle = lightShade;

        ctx.rect(0, 0, geo.width, geo.height);

        ctx.fill();

        const vw = geo.width/100;

        let calcSwaps = (gutterOffset, lineSpacing, headerOffset) => {
            return lineSwaps.flatMap((s, i) => {
                let arr = [
                    {x: i%2 ? gutterOffset + lineSpacing : geo.width - gutterOffset + lineSpacing, y: s + headerOffset + lineSpacing},
                    {x: i%2 ? geo.width - gutterOffset + lineSpacing : gutterOffset + lineSpacing, y: s + headerOffset + lineSpacing},
                ];

                return arr;
            });
        }

        let calcPoint = (gutterOffset, headerOffset, lineSpacing) => {
            return {points: [{x: geo.width - gutterOffset + lineSpacing, y: 0}, ...calcSwaps(gutterOffset, lineSpacing, headerOffset), {x: geo.width - gutterOffset + lineSpacing, y: geo.height+100}]}
        }

        let createSegment = (color, gutterOffset, headerOffset) => {
            let lineSpacing = 12;

            return {
                color: color,
                lines: [
                    calcPoint(gutterOffset, headerOffset, 0),
                    calcPoint(gutterOffset, headerOffset, -lineSpacing),
                    calcPoint(gutterOffset, headerOffset, -lineSpacing*2),
                    calcPoint(gutterOffset, headerOffset, lineSpacing),
                    calcPoint(gutterOffset, headerOffset, lineSpacing*2),
                ]
            }
        }

        let segmentSpacing = 65;
        let gutterWidth = 50;

        const segments = [
            createSegment(darkAccent, gutterWidth, 0),
            createSegment(main, (gutterWidth) + segmentSpacing, + segmentSpacing),
            createSegment(darkShade, (gutterWidth) + segmentSpacing *2, + segmentSpacing*2),
        ]

        // const segments = [
        //     {
        //         color: darkAccent,
        //         lines: [
        //             {points: [{x: centerOffset, y: 0}, {x: centerOffset, y: geo.height}]},
        //             {points: [{x: centerOffset - lineOffset * 2, y: 0}, {x: centerOffset - lineOffset * 2, y: geo.height}]},
        //             {points: [{x: centerOffset - lineOffset, y: 0}, {x: centerOffset - lineOffset, y: geo.height}]},
        //             {points: [{x: centerOffset + lineOffset * 2, y: 0}, {x: centerOffset + lineOffset * 2, y: geo.height}]},
        //             {points: [{x: centerOffset + lineOffset, y: 0}, {x: centerOffset + lineOffset, y: geo.height}]}
        //         ]
        //     },
        //     {
        //         color: main,
        //         lines: [
        //             {points: [{x: line1Offset +centerOffset, y: 0}, {x: line1Offset +centerOffset, y: geo.height}]},
        //             {points: [{x: line1Offset +centerOffset - lineOffset * 2, y: 0}, {x: line1Offset +centerOffset - lineOffset * 2, y: geo.height}]},
        //             {points: [{x: line1Offset +centerOffset - lineOffset, y: 0}, {x: line1Offset +centerOffset - lineOffset, y: geo.height}]},
        //             {points: [{x: line1Offset +centerOffset + lineOffset * 2, y: 0}, {x: line1Offset +centerOffset + lineOffset * 2, y: geo.height}]},
        //             {points: [{x: line1Offset +centerOffset + lineOffset, y: 0}, {x: line1Offset +centerOffset + lineOffset, y: geo.height}]}
        //         ]
        //     },
        //     {
        //         color: darkShade,
        //         lines: [
        //             {points: [{x: line2Offset + centerOffset, y: 0}, {x: line2Offset + centerOffset, y: geo.height}]},
        //             {points: [{x: line2Offset + centerOffset - lineOffset * 2, y: 0}, {x: line2Offset + centerOffset - lineOffset * 2, y: geo.height}]},
        //             {points: [{x: line2Offset + centerOffset - lineOffset, y: 0}, {x: line2Offset + centerOffset - lineOffset, y: geo.height}]},
        //             {points: [{x: line2Offset + centerOffset + lineOffset * 2, y: 0}, {x: line2Offset + centerOffset + lineOffset * 2, y: geo.height}]},
        //             {points: [{x: line2Offset + centerOffset + lineOffset, y: 0}, {x: line2Offset + centerOffset + lineOffset, y: geo.height}]}
        //         ]
        //     }
        // ];

        for(let segment of segments) {
            for(let line of segment.lines) {
                ctx.beginPath();
                ctx.strokeStyle = segment.color;
                ctx.lineWidth = 6;
                let first = line.points.shift();
                ctx.moveTo(first.x, first.y);
                console.log(`start: ${first.x}, ${first.y}`);
                for(let point of line.points) {
                    ctx.lineTo(point.x, point.y);
                    console.log(`move: ${point.x},${point.y}`);
                }

                ctx.stroke();
            }
        }

        // console.log(properties.get('--grid-zoom'));

        // let rippleSpeed = parseInt(properties.get('--ripple-speed').toString());

        // ctx.lineStyle(3, 0x424242, 1);
        // const color = (properties.get('--ripple-color') || 'red').toString();

        // const tick = parseInt(properties.get('--animation-tick').toString());

        // const origin = {
        //     x: +(properties.get('--ripple-origin-x') || 0),
        //     y: +(properties.get('--ripple-origin-y') || 0),
        // };

        // if(tick > 1000) return;

        // if(tick > 0) {

        //     if(tick > 750) {
        //         ctx.globalAlpha = 1-(tick%750)/250;
        //         console.log(1-(tick%750)/250);
        //     }

        //     ctx.fillStyle = color;
        //     ctx.arc(origin.x, origin.y, tick * (rippleSpeed), 0, 2 * Math.PI);
        // }

        // const halfWidth = geo.width / 2;
        // const halfHeight = geo.height / 2;
        // const cellSize = desiredZoom;
        // for (let x = halfWidth % cellSize - (cellSize / 2); x < geo.width; x += cellSize) {
        //   ctx.moveTo(x, 0);
        //   ctx.lineTo(x, geo.height);
        // }
    
        // for (let y = halfHeight % cellSize - (cellSize / 2); y < geo.height; y += cellSize) {
        //   ctx.moveTo(0, y);
        //   ctx.lineTo(geo.width, y);
        // }

        // ctx.fill();
    }
}

registerPaint('linePattern', linePainter);