import type { CompilerDiagnostic } from '@dbml/core';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

export function convertToMarker(diags: CompilerDiagnostic[]): Monaco.editor.IMarkerData[] {
	return diags.map(({ location, message, type }) => {
		const {
			start: { line: startLine, column: startColumn },
			end
		} = location;
		const { line: endLine, column: endColumn } = end ?? location.start;

		return {
			severity: type === 'error' ? Monaco.MarkerSeverity.Error : Monaco.MarkerSeverity.Warning,
			message: message,
			startLineNumber: startLine,
			startColumn: startColumn,
			endLineNumber: endLine,
			endColumn: endColumn
		};
	});
}
