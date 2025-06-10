import { Element, GlobalKey, Stack, State, StatefulWidget, Widget } from '@meursyphus/flitter';
import DiagramControllerProvider from '../Provider/DiagramControllerProvider';
import { classToFunction } from '../utils';
import Edge from './Edge';
import type { DiagramController } from '$lib/components/diagram/controller';
import type { FieldId } from '$lib/components/diagram/type';
import { FieldInsertEvent, FieldRemoveEvent } from '$lib/components/diagram/event/field';
import type { EventManager } from '$lib/components/diagram/event';
import { EventManagerProvider } from '../Provider';

class RefDrawer extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new RefDrawerState();
	}
}

class RefDrawerState extends State<RefDrawer> {
	fields: Record<FieldId, GlobalKey> = {};
	controller!: DiagramController;
	eventManager!: EventManager;
	initState(context: Element): void {
		super.initState(context);
		this.controller = DiagramControllerProvider.of(context);
		this.eventManager = EventManagerProvider.of(context);
		this.eventManager.addEventListener(FieldInsertEvent.type, this.handleFieldInsert);
		/**
		 * this.eventManager.addEventListener(FieldRemoveEvent.type, this.handleFieldRemove);
		 *
		 * 주석처리 이유:
		 * initialNode -> legacyNode로 전환될 때, initialNode가 unmount되고 legacyNode가 mount된다.
		 * Node안에 있는 Field 컴포넌트도 역시 unmount와 mount가 발생하는데, 이때 발생순서가 LegacyNode의 mount가 먼저 발생하고, initialNode의 Field가 unmount된다.
		 * 때문에 Node를 움직이고 나면, this.fields의 값이 사라져 있다.
		 * 이는 initialNode -> legacyNode로 전환될때 unmount가 발생하지 않으면 자연스럽게 해결된다.
		 * 해당 이슈는 Flitter의 GlobalKey 기능이 패치되면 해결된다.
		 * @see: https://github.com/meursyphus/flitter/issues/31
		 */
	}

	handleFieldInsert = (e: FieldInsertEvent) => {
		this.fields[e.id] = e.key;
	};

	handleFieldRemove = (e: FieldRemoveEvent) => {
		delete this.fields[e.id];
	};

	build(): Widget {
		const relatedFields = this.controller.getAllRelatedFields();
		return Stack({
			children: relatedFields.map(({ from, to }) => Edge({ from, to, fields: this.fields }))
		});
	}
}

export default classToFunction(RefDrawer);
