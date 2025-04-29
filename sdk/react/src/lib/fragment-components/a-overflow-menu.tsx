import React from 'react';
import {
	Checkbox,
	Dropdown,
	OverflowMenu,
	TextInput,
	OverflowMenuItem
} from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/overflowMenu.svg';
import {
	reactClassNamesFromComponentObj,
	angularClassNamesFromComponentObj,
	nameStringToVariableString
} from '../helpers/tools';
import { css, cx } from 'emotion';
import { styleObjectToString } from '@carbon-builder/player-react';
import { DraggableTileList } from '../helpers/draggable-list';

const preventCheckEvent = css`
	pointer-events: none;
`;

export const AOverflowMenuSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const placementItems = [
		{ id: 'top', text: 'Top' },
		{ id: 'bottom', text: 'Bottom' }
	];

	const updateListItems = (key: string, value: any, index: number) => {
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
				value={item.itemText}
				labelText='Label'
				onChange={(event: any) => {
					updateListItems('itemText', event.currentTarget.value, index);
				}}
			/>
			<TextInput
				light
				value={item.link}
				labelText='Link'
				onChange={(event: any) => {
					updateListItems('link', event.currentTarget.value, index);
				}}
			/>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				<Checkbox
					labelText='Disabled'
					id={`disabled-${index}`}
					checked={item.disabled}
					onChange={(_: any, { checked }: any) => updateListItems('disabled', checked, index)}/>
				<Checkbox
					labelText='Is delete'
					id={`isDelete-${index}`}
					checked={item.isDelete}
					onChange={(_: any, { checked }: any) => updateListItems('isDelete', checked, index)} />
				<Checkbox
					labelText='Has divider'
					id={`hasDivider-${index}`}
					checked={item.hasDivider}
					onChange={(_: any, { checked }: any) => updateListItems('hasDivider', checked, index)} />
			</div>
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
			labelText='Flip left'
			id='flipped'
			checked={selectedComponent.flipped}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				flipped: checked
			})} />
		<Dropdown
			label='Placement'
			titleText='Placement'
			items={placementItems}
			selectedItem={placementItems.find(item => item.id === selectedComponent.placement)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placement: event.selectedItem.id
			})} />
		<DraggableTileList
			dataList={[...selectedComponent.items]}
			setDataList={updateStepList}
			updateItem={updateListItems}
			defaultObject={{
				type: 'overflow-menu-item',
				itemText: 'New option',
				disabled: false,
				isDelete: false,
				hasDivider: false
			}}
			template={template} />
	</>;
};

export const AOverflowMenuCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const AOverflowMenu = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		{...rest}>
			<OverflowMenu
				flipped={componentObj.flipped}
				direction={componentObj.placement}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					preventCheckEvent,
					css`${styleObjectToString(componentObj.style)}`
				)}>
				{
					componentObj.items.map((step: any, index: number) => <OverflowMenuItem
						className={step.className}
						href={step.link}
						itemText={step.itemText}
						disabled={step.disabled}
						isDelete={step.isDelete}
						key={index}
					/>)
				}
			</OverflowMenu>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AOverflowMenu,
	codeUI: AOverflowMenuCodeUI,
	settingsUI: AOverflowMenuSettingsUI,
	keywords: ['overflow', 'menu', 'context'],
	name: 'Overflow menu',
	type: 'overflow-menu',
	defaultComponentObj: {
		flipped: false,
		placement: 'bottom',
		type: 'overflow-menu',
		items: [
			{
				type: 'overflow-menu-item',
				itemText: 'Option 1',
				disabled: false,
				isDelete: false,
				hasDivider: false
			},
			{
				type: 'overflow-menu-item',
				itemText: 'Option 2',
				disabled: false,
				isDelete: false,
				hasDivider: false
			}
		]
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Flipped = ${json.flipped};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placement = "${json.placement}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
				imports: ['DialogModule'],
				code: ({ json }) => {
					return `<cds-overflow-menu
					[placement]="${nameStringToVariableString(json.codeContext?.name)}Placement"
					[flip]="${nameStringToVariableString(json.codeContext?.name)}Flipped"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) => (
						`<cds-overflow-menu-option
							${step.isDelete ? "type='danger'" : ''}
							${step.hasDivider ? `[divider]="${step.hasDivider}"` : ''}
							${step.link !== undefined ? `href="${step.link}"` : ''}
							${step.disabled ? `disabled="${step.disabled}"` : '' }
							(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
							(click)="${nameStringToVariableString(json.codeContext?.name)}Clicked.emit($event)">
								${step.itemText}
						</cds-overflow-menu-option>`
					)).join('\n')}
					</cds-overflow-menu>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Flipped = ${json.flipped};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Placement = "${json.placement}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();
					@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
				imports: ['DialogModule'],
				code: ({ json }) => {
					return `<ibm-overflow-menu
						[placement]="${nameStringToVariableString(json.codeContext?.name)}Placement"
						[flip]="${nameStringToVariableString(json.codeContext?.name)}Flipped"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((step: any) => (
							`<ibm-overflow-menu-option
								${step.isDelete ? "type='danger'" : ''}
								${step.hasDivider ? `[divider]="${step.hasDivider}"` : ''}
								${step.link !== undefined ? `href="${step.link}"` : ''}
								${step.disabled ? `disabled="${step.disabled}"` : '' }
								(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
								(click)="${nameStringToVariableString(json.codeContext?.name)}Clicked.emit($event)">
									${step.itemText}
							</ibm-overflow-menu-option>`
						)).join('\n')}
					</ibm-overflow-menu>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['OverflowMenu', 'OverflowMenuItem'],
				code: ({ json }) => {
					return `<OverflowMenu
						direction="${json.placement}"
						flipped={${json.flipped}}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) => (
							`<OverflowMenuItem
								${step.link !== undefined ? `href="${step.link}"` : ''}
								${step.isDelete !== undefined ? `isDelete={${step.isDelete}}` : ''}
								${step.hasDivider !== false ? 'hasDivider': ''}
								disabled={${step.disabled}}
								itemText="${step.itemText}"/>`
						)).join('\n')}
					</OverflowMenu>`;
				}
			},
			v10: {
				imports: ['OverflowMenu', 'OverflowMenuItem'],
				code: ({ json }) => {
					return `<OverflowMenu
						direction="${json.placement}"
						flipped={${json.flipped}}
						${reactClassNamesFromComponentObj(json)}>
						${json.items.map((step: any) => (
							`<OverflowMenuItem
								${step.link !== undefined ? `href="${step.link}"` : ''}
								${step.isDelete !== undefined ? `isDelete={${step.isDelete}}` : ''}
								${step.hasDivider !== false ? 'hasDivider': ''}
								disabled={${step.disabled}}
								itemText="${step.itemText}"/>`
						)).join('\n')}
					</OverflowMenu>`;
				}
			}
		}
	}
};
