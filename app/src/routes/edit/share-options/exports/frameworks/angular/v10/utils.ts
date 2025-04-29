import { Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import { allComponents, tagNameFromFragment } from '@carbon-builder/sdk-react';
import { addIfNotExist } from '@carbon-builder/player-react';

export const formatOptionsTypescript: Options = {
	plugins: [parserBabel],
	trailingComma: 'none',
	useTabs: true,
	parser: 'babel-ts'
};

export const formatOptionsHtml: Options = {
	plugins: [parserHtml],
	trailingComma: 'none',
	useTabs: true,
	parser: 'html'
};

export const formatOptionsCss: Options = {
	parser: 'css',
	plugins: [parserCss]
};

export const jsonToAngularImports = (json: any) => {
	const imports: any[] = [];

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type) {
			addIfNotExist(imports, component.componentInfo.codeExport.angular?.v10.imports);
		}
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			addIfNotExist(imports, jsonToAngularImports(item));
		});
	}

	return imports;
};

export const getAngularInputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.v10.inputs({ json }) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularInputsFromJson(item)).join('\n') : ''}
	`;
};

export const getAngularOutputsFromJson = (json: any): string => {
	const getOne = (json: any) => {
		for (const component of Object.values(allComponents)) {
			if (json.type === component.componentInfo.type) {
				return component.componentInfo.codeExport.angular?.v10.outputs({ json }) || '';
			}
		}
		return '';
	};

	return `${getOne(json)} ${json.items ? json.items.map((item: any) => getAngularOutputsFromJson(item)).join('\n') : ''}
	`;
};
export const jsonToTemplate = (json: any, fragments: any[], customComponentsCollections: any[]) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	for (const component of Object.values(allComponents)) {
		if (json.type === component.componentInfo.type && !component.componentInfo.codeExport.angular.v10.isNotDirectExport) {
			return component.componentInfo.codeExport.angular.v10.code({ json, jsonToTemplate, fragments, customComponentsCollections });
		}
	}

	if (json.items) {
		return json.items.map((item: any) => jsonToTemplate(item, fragments, customComponentsCollections)).join('\n');
	}
};

export const getAllSubfragments = (json: any, fragments: any[]) => {
	let sharedComponents: any = {};

	if (json.type === 'fragment') {
		const fragment = fragments.find(f => f.id === json.fragmentId);

		sharedComponents[tagNameFromFragment(fragment)] = fragment;

		sharedComponents = {
			...sharedComponents,
			...getAllSubfragments(fragment.data, fragments)
		};
	}

	json.items?.forEach((item: any) => {
		sharedComponents = {
			...sharedComponents,
			...getAllSubfragments(item, fragments)
		};
	});

	return sharedComponents;
};
