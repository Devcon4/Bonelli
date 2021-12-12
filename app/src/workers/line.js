class linePainter {
    static get inputProperties() { return ['--line-background', '--line-offscreen', '--line-color-center', '--line-color-left', '--line-color-right', '--line-swaps']; }
    paint(ctx, geo, properties) {
        const lineBackground = (properties.get('--line-background').toString());
        const main = (properties.get('--line-color-center').toString());
        const darkAccent = (properties.get('--line-color-left').toString());
        const darkShade = (properties.get('--line-color-right').toString());
        var goOffscreen = (properties.get('--line-offscreen').toString());

        const lineSwaps = (properties.get('--line-swaps').toString().split(',').map(v => v.replace(/"/g, '')));

        ctx.fillStyle = lineBackground;

        ctx.rect(0, 0, geo.width, geo.height);

        ctx.fill();

        const vw = geo.width/100;
        const vh = geo.height/100;

        let calcSwaps = (gutterOffset, lineSpacing, headerOffset) => {

            let [first] = lineSwaps;
            let arr = goOffscreen ? [first, '800%'] : lineSwaps;

            return arr.flatMap((s, i) => {
                
                if (s.endsWith('%')) {
                    s = parseFloat(s.substr(0, s.length-1)) * vh;
                } else {
                    s = parseFloat(s);
                }

                let arr = [
                    {x: i%2 ? gutterOffset + lineSpacing : geo.width - gutterOffset + lineSpacing, y: s + headerOffset + lineSpacing},
                    ...(!goOffscreen ? [{x: i%2 ? geo.width - gutterOffset + lineSpacing : gutterOffset + lineSpacing, y: s + headerOffset + lineSpacing}]:
                    [{x: -100, y: s + headerOffset + lineSpacing }, {x: -100, y: geo.height+100}])
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
        for(let segment of segments) {
            for(let line of segment.lines) {
                ctx.beginPath();
                ctx.strokeStyle = segment.color;
                ctx.lineWidth = 6;
                let first = line.points.shift();
                ctx.moveTo(first.x, first.y);
                for(let point of line.points) {
                    ctx.lineTo(point.x, point.y);
                }

                ctx.stroke();
            }
        }
    }
}

registerPaint('linePattern', linePainter);