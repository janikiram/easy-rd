import { Parser } from '@dbml/core';
import type { CompilerDiagnostics, CompilerDiagnostic } from '@dbml/core';
import {
	type Group,
	ProjectModel,
	type Token as RToken,
	type Table as RTable,
	type Schema as RSchema,
	type Enum as REnum,
	type Field as RField,
	type Index as RIndex,
	type IndexColumn as RIndexColumn,
	type Endpoint as REndpoint,
	type Ref as RRef,
	type FieldType as RFieldType
} from './type';

import type Database from '@dbml/core/types/model_structure/database';
import type Schema from '@dbml/core/types/model_structure/schema';
import type TableGroup from '@dbml/core/types/model_structure/tableGroup';
import type Table from '@dbml/core/types/model_structure/table';
import type Field from '@dbml/core/types/model_structure/field';
import type Index from '@dbml/core/types/model_structure/indexes';
import type IndexColumn from '@dbml/core/types/model_structure/indexColumn';
import type Endpoint from '@dbml/core/types/model_structure/endpoint';
import type Ref from '@dbml/core/types/model_structure/ref';
import type Enum from '@dbml/core/types/model_structure/enum';
import type { Token } from '@dbml/core/types/model_structure/element';

export type { CompilerDiagnostics as CompilerError, CompilerDiagnostic };

export function parse(dbml: string): ProjectModel {
	const parser = new Parser(undefined);
	const database = parser.parse(dbml, 'dbml');
	return resolveProject(database);
}

function resolveProject({ id, name, note, databaseType, schemas }: Database): ProjectModel {
	return new ProjectModel({ id, name, databaseType, note, schemas: schemas.map(resolveSchema) });
}

function resolveSchema({ id, name, note, enums, tableGroups, tables, refs }: Schema): RSchema {
	return {
		id,
		name,
		note,
		enums: enums.map(resolveEnum),
		groups: tableGroups.map(resolveTableGroup),
		tables: tables.map(resolveTable),
		refs: refs.map(resolveRef)
	};
}

function resolveEnum({ id, name, note, values }: Enum): REnum {
	return { id, name: name ?? '', note: note ?? '', values: values.map((ev) => ev.name) };
}

function resolveToken({ start, end }: Token): RToken {
	return {
		start: { offset: start.offset, line: start.line, column: start.column },
		end: { offset: end.offset, line: end.line, column: end.column }
	};
}

function resolveTableGroup({ id, name, tables, token }: TableGroup): Group {
	return { id, name, tableIds: tables.map(({ id }) => id), token: resolveToken(token) };
}

function resolveTable({ id, name, note, fields, indexes, headerColor, token }: Table): RTable {
	return {
		id,
		name,
		note: note ?? '',
		fields: fields.map(resolveField),
		indexes: indexes.map(resolveIndex),
		meta: { headerColor },
		token: resolveToken(token)
	};
}

function resolveField({
	id,
	name,
	note,
	type,
	increment,
	not_null: notNull,
	pk,
	endpoints,
	token,
	dbdefault
}: Field): RField {
	return {
		id,
		name,
		note: note ?? '',
		type: resolveFieldType(type),
		increment: increment ?? false,
		notNull: notNull ?? false,
		pk: pk ?? false,
		endpoints: endpoints.map(resolveEndpoint),
		token: resolveToken(token),
		default: dbdefault?.value
	};
}

type FieldType = {
	args: unknown;
	schemaName: string;
	type_name: string;
};

function resolveFieldType({ args, schemaName, type_name: typeName }: FieldType): RFieldType {
	return { args, schemaName: schemaName ?? '', typeName };
}

function resolveEndpoint({ id, relation, tableName, fieldNames, ref }: Endpoint): REndpoint {
	return {
		id,
		relation,
		tableName,
		fieldNames,
		refId: ref.id,
		token: resolveToken(ref.token)
	};
}

function resolveIndex({ id, name, note, unique, pk, columns, token }: Index): RIndex {
	return {
		id,
		name,
		note,
		unique,
		pk,
		columns: columns.map(resolveIndexColumn),
		token: resolveToken(token)
	};
}

function resolveIndexColumn({ id, type, value }: IndexColumn): RIndexColumn {
	return {
		id,
		type,
		value
	};
}

function resolveRef({ id, name, endpoints, token }: Ref): RRef {
	return {
		id,
		name: name ?? '',
		endpointIds: endpoints.map(({ id }) => id),
		token: resolveToken(token)
	};
}

export * from './type';
