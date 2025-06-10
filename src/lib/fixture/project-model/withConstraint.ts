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
					name: 'users',
					note: '',
					fields: [
						{
							id: 1,
							name: 'id',
							note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.',
							type: { args: null, schemaName: '', typeName: 'integer' },
							increment: true,
							notNull: true,
							pk: true,
							endpoints: [],
							token: {
								start: { offset: 17, line: 3, column: 3 },
								end: { offset: 107, line: 4, column: 1 }
							},
							default: 123
						},
						{
							id: 2,
							name: 'username',
							note: '',
							type: { args: null, schemaName: '', typeName: 'varchar' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 107, line: 4, column: 1 },
								end: { offset: 126, line: 5, column: 1 }
							}
						},
						{
							id: 3,
							name: 'role',
							note: '',
							type: { args: null, schemaName: '', typeName: 'varchar' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 126, line: 5, column: 1 },
								end: { offset: 141, line: 6, column: 1 }
							}
						},
						{
							id: 4,
							name: 'created_at',
							note: '',
							type: { args: null, schemaName: '', typeName: 'timestamp' },
							increment: false,
							notNull: false,
							pk: false,
							endpoints: [],
							token: {
								start: { offset: 141, line: 6, column: 1 },
								end: { offset: 164, line: 7, column: 1 }
							}
						}
					],
					indexes: [],
					meta: {},
					token: {
						start: { offset: 1, line: 2, column: 1 },
						end: { offset: 165, line: 7, column: 2 }
					}
				}
			],
			refs: []
		}
	]
};

export default data;
