import { CustomPaint, Element, Size, State, StatefulWidget } from '@meursyphus/flitter';
import type { Line as LineProps } from './type';
import type { DiagramController } from '$lib/components/diagram/controller';
import { classToFunction } from '../utils';

class Line extends StatefulWidget {
	line: LineProps;
	constructor({ line, key }: { line: LineProps; key?: unknown }) {
		super(key);
		this.line = line;
	}

	createState(): State<StatefulWidget> {
		return new LineState();
	}
}

class LineState extends State<Line> {
	controller!: DiagramController;
	initState(context: Element): void {
		super.initState(context);
	}

	resolveProps(props: LineProps, size: Size): { x1: number; x2: number; y1: number; y2: number } {
		let result: { x1: number; x2: number; y1: number; y2: number };

		const { translation, scale } = this.element.renderContext.viewPort;
		if (props.type === 'horizontal') {
			const { y } = props;
			result = {
				x1: 0 / scale - translation.x,
				x2: size.width / scale - translation.x,
				y1: y,
				y2: y
			};
		} else {
			const { x } = props;
			result = {
				x1: x,
				x2: x,
				y1: 0 / scale - translation.y,
				y2: size.height / scale - translation.y
			};
		}
		return result;
	}

	override build() {
		return CustomPaint({
			painter: {
				shouldRepaint: () => true,
				createDefaultSvgEl: (paintContext) => ({
					line: paintContext.createSvgEl('line')
				}),
				paint: ({ line }, size) => {
					const { x1, y1, x2, y2 } = this.resolveProps(this.widget.line, size);
					line.setAttribute('x1', `${x1}`);
					line.setAttribute('y1', `${y1}`);
					line.setAttribute('x2', `${x2}`);
					line.setAttribute('y2', `${y2}`);

					line.setAttribute('stroke', 'black');
					line.setAttribute('stroke-width', '1');
					line.setAttribute('stroke-dasharray', '5,5');
				}
			}
		});
	}
}

export default classToFunction(Line);
