import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import languageConfiguration from './dbml.language-configuration';
import monarchTokensProvider from './dbml.language-monarch';

self.MonacoEnvironment = {
	getWorker(_: string, _label: string) {
		return new editorWorker();
	}
};

monaco.languages.register({ id: 'dbml' });
monaco.languages.setLanguageConfiguration('dbml', languageConfiguration);
monaco.languages.setMonarchTokensProvider('dbml', monarchTokensProvider);

export default monaco;
