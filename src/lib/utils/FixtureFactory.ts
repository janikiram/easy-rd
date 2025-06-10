import { Faker, faker as _faker } from '@faker-js/faker';
import { FixtureFactory as _FixtureFactory } from '@reflow-work/test-fixture-factory';

class FixtureFactory<T> {
	faker: Faker;
	factory: _FixtureFactory<T>;
	seed: number;
	constructor(creator: (faker: Faker) => Required<T>, option: { seed?: number } = {}) {
		this.faker = _faker;
		this.seed = option.seed ?? 0;
		this.factory = new _FixtureFactory<T>(() => creator(this.faker));
	}

	createList(count: number): T[] {
		this.faker.seed(this.seed);
		const result = this.factory.createList(count);
		this.seed += count;
		return result;
	}
	create(): T {
		this.faker.seed(this.seed);
		const result = this.factory.create();
		this.seed += 1;
		return result;
	}
}

export default FixtureFactory;
