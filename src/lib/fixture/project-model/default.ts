import type { ProjectModel } from './type';

const data: ProjectModel = {
	id: 1,
	name: '',
	databaseType: '',
	note: '',
	schemas: [
		{
			id: 1,
			name: 'public',
			note: 'Default Public Schema',
			enums: [],
			groups: [],
			tables: [
				{
					id: 1,
					name: 'member',
					note: '',
					fields: [
						{
							id: 1,
							name: 'id',
							note: '',
							type: { args: null, schemaName: '', typeName: 'uuid' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 18, line: 3, column: 3 },
								end: { offset: 26, line: 4, column: 1 }
							}
						},
						{
							id: 2,
							name: 'name',
							note: '',
							type: { args: '200', schemaName: '', typeName: 'varchar(200)' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 26, line: 4, column: 1 },
								end: { offset: 46, line: 5, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 1, line: 2, column: 1 },
						end: { offset: 47, line: 5, column: 2 }
					}
				}
			],
			refs: []
		}
	]
};

export default data;
