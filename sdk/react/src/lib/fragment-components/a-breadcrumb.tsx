import React from 'react';
import {
	Breadcrumb,
	TextInput,
	BreadcrumbItem,
	Checkbox
} from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/breadcrumb.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { css, cx } from 'emotion';
import { styleObjectToString } from '@carbon-builder/player-react';
import { DraggableTileList } from '../helpers/draggable-list';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const ABreadcumbSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const handleStepUpdate = (key: string, value: any, index: number) => {
		const step = {
			...selectedComponent.items[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			items: [
				...selectedComponent.items.slice(0, index),
				step,
				...selectedComponent.items.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				light
				value={item.label}
				labelText='Breadcrumb label'
				onChange={(event: any) => {
					handleStepUpdate('label', event.currentTarget.value, index);
				}}
			/>
			<TextInput
				light
				value={item.href}
				labelText='Link'
				onChange={(event: any) => {
					handleStepUpdate('href', event.currentTarget.value, index);
				}}
			/>
		</>;
	};
	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			items: newList
		});
	};
	return <>
		<Checkbox
			labelText='Use trailing slash'
			id='trailing-slash'
			checked={!selectedComponent.noTrailingSlash}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					noTrailingSlash: !checked
				});
			}}
		/>
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={handleStepUpdate}
			defaultObject={{
				type: 'breadcrumb-item',
				label: 'Breadcrumb',
				href: '/'
			}}
			template={template}
		/>
	</>;
};

export const ABreadcrumbCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				...selectedComponent.codeContext,
				name: event.currentTarget.value
			}
		});
	}} />;

export const ABreadcrumb = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Breadcrumb
			noTrailingSlash={componentObj.noTrailingSlash}
			className={cx(
				preventCheckEventStyle,
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}>
			{
				componentObj.items.map((step: any, index: number) => <BreadcrumbItem
					href={step.href}
					key={index}>
						{step.label}
				</BreadcrumbItem>)
			}
			</Breadcrumb>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ABreadcrumb,
	settingsUI: ABreadcumbSettingsUI,
	codeUI: ABreadcrumbCodeUI,
	keywords: ['breadcrumb'],
	name: 'Breadcrumb',
	type: 'breadcrumb',
	defaultComponentObj: {
		type: 'breadcrumb',
		noTrailingSlash: false,
		items: [
			{
				type: 'breadcrumb-item',
				label: 'Breadcrumb',
				href: '/'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}NoTrailingSlash = ${json.noTrailingSlash};`,
				outputs: (_) => '',
				imports: ['BreadcrumbModule'],
				code: ({ json }) => {
					return `<cds-breadcrumb
						[noTrailingSlash]="${nameStringToVariableString(json.codeContext?.name)}NoTrailingSlash"
						${angularClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) => (
							`<cds-breadcrumb-item
								href="${step.href}">
									${step.label}
							</cds-breadcrumb-item>`
							)).join('\n')}
					</cds-breadcrumb>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}NoTrailingSlash = ${json.noTrailingSlash};`,
				outputs: (_) => '',
				imports: ['BreadcrumbModule'],
				code: ({ json }) => {
					return `<ibm-breadcrumb
						[noTrailingSlash]="${nameStringToVariableString(json.codeContext?.name)}NoTrailingSlash"
						${angularClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) => (
							`<ibm-breadcrumb-item
								href="${step.href}">
									${step.label}
							</ibm-breadcrumb-item>`
							)).join('\n')}
					</ibm-breadcrumb>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Breadcrumb', 'BreadcrumbItem'],
				code: ({ json }) => {
					return `<Breadcrumb
						noTrailingSlash={${json.noTrailingSlash}}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) =>
							`<BreadcrumbItem href="${step.href}">
								${step.label}
							</BreadcrumbItem>`).join('\n')}
						</Breadcrumb>`;
				}
			},
			v10: {
				imports: ['Breadcrumb', 'BreadcrumbItem'],
				code: ({ json }) => {
					return `<Breadcrumb
						noTrailingSlash={${json.noTrailingSlash}}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) =>
							`<BreadcrumbItem href="${step.href}">
								${step.label}
							</BreadcrumbItem>`).join('\n')}
						</Breadcrumb>`;
				}
			}
		}
	}
};
