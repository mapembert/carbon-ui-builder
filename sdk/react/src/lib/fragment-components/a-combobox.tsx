import React from 'react';
import {
	Checkbox,
	Dropdown,
	ComboBox,
	FilterableMultiSelect,
	TextInput
} from '@carbon/react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/combobox.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';
import { DraggableTileList } from '../helpers/draggable-list';
import { preventClickStyle } from '../helpers/styles';

export const AComboBoxSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' }
	];

	const directionItems = [
		{ id: 'bottom' },
		{ id: 'top' }
	];

	const selectionFeedbackItems = [
		{ id: 'top' },
		{ id: 'fixed' },
		{ id: 'top-after-reopen' }
	];

	const handleItemUpdate = (key: string, value: any, index: number) => {
		const item = {
			...selectedComponent.listItems[index],
			[key]: value
		};

		setComponent({
			...selectedComponent,
			listItems: [
				...selectedComponent.listItems.slice(0, index),
				item,
				...selectedComponent.listItems.slice(index + 1)
			]
		});
	};

	const template = (item: any, index: number) => {
		return <>
			<TextInput
				id={`combobox-display-item-${index}-text-input`}
				light
				value={item.text}
				labelText='Display text'
				onChange={(event: any) => handleItemUpdate('text', event.currentTarget.value, index)} />
			{
				selectedComponent.isMulti &&
				<div style={{ display: 'flex' }}>
					<Checkbox
						style={{ display: 'inline-flex' }}
						labelText='Is default selected'
						id={`invalid-select-${index}`}
						checked={item.selected}
						onChange={(_: any, { checked }: any) => handleItemUpdate('selected', checked, index)} />
				</div>
			}
		</>;
	};

	const updateStepList = (newList: any[]) => {
		setComponent({
			...selectedComponent,
			listItems: newList
		});
	};

	return <>
		<Checkbox
			labelText='Is multiselect'
			id='multi-label'
			checked={selectedComponent.isMulti}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				isMulti: checked
			})} />
		{
			selectedComponent.isMulti && <Checkbox
				labelText='Is inline'
				id='inline-label'
				checked={selectedComponent.isInline}
				onChange={(_: any, { checked }: any) => setComponent({
					...selectedComponent,
					isInline: checked
				})}
			/>
		}
		<Dropdown
			id='combobox-size-dropdown'
			label='Size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})} />
		<Dropdown
			id='combobox-direction-dropdown'
			label='Direction'
			titleText='Dropdown direction'
			items={directionItems}
			selectedItem={directionItems.find(item => item.id === selectedComponent.direction)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				direction: event.selectedItem.id
		})} />
		{selectedComponent.isMulti && <Dropdown
			id='combobox-feedback-dropdown'
			label='Feedback'
			titleText='Selection feedback'
			items={selectionFeedbackItems}
			selectedItem={selectionFeedbackItems.find(item => item.id === selectedComponent.selectionFeedback)}
			itemToString={(item: any) => (item ? item.id : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				selectionFeedback: event.selectedItem.id
		})} />}
		<TextInput
			id='combobox-label-text-input'
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				label: event.currentTarget.value
		})} />
		<Checkbox
			labelText='Hide label'
			id='hide-label-checkbox'
			checked={selectedComponent.hideLabel}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				hideLabel: checked
		})} />
		<TextInput
			id='combobox-placeholder-text-input'
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				placeholder: event.currentTarget.value
		})} />
		<TextInput
			id='combobox-helper-text-input'
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				helperText: event.currentTarget.value
		})} />
		<TextInput
			id='combobox-warn-text-input'
			value={selectedComponent.warnText}
			labelText='Warning text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				warnText: event.currentTarget.value
		})} />
		<TextInput
			id='combobox-invalid-text-input'
			value={selectedComponent.invalidText}
			labelText='Invalid text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				invalidText: event.currentTarget.value
		})} />
		<Checkbox
			labelText='Light theme'
			id='theme-select-checkbox'
			checked={selectedComponent.light}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				light: checked
		})} />
		<hr />
		<h4>Items</h4>
		<DraggableTileList
			dataList={[...selectedComponent.listItems]}
			setDataList={updateStepList}
			updateItem={handleItemUpdate}
			defaultObject={{
				text: 'Text'
			}}
			template={template} />
		<hr />
	</>;
};

export const AComboBoxCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	id='combobox-input-name-text-input'
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

export const AComboBox = ({
	componentObj,
	...rest
}: any) => {
	// Determine which React Component to render based on dropdownType
	let ComboboxOrFilterableMultiSelect = ComboBox;
	if (componentObj.isMulti) {
		ComboboxOrFilterableMultiSelect = FilterableMultiSelect;
	}
	const filterableProps = {
		type: componentObj.isInline ? 'inline' : 'default',
		hideLabel: componentObj.hideLabel,
		selectionFeedback: componentObj.selectionFeedback
	};

	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		{...rest}>
			<ComboboxOrFilterableMultiSelect
				{...componentObj.isMulti ? filterableProps: {}}
				id={componentObj.codeContext?.name}
				titleText={componentObj.label}
				size={componentObj.size}
				light={componentObj.light}
				disabled={componentObj.disabled}
				helperText={componentObj.helperText}
				warn={componentObj.warn}
				warnText={componentObj.warnText}
				invalid={componentObj.invalid}
				invalidText={componentObj.invalidText}
				direction={componentObj.direction}
				placeholder={componentObj.placeholder}
				onChange={() => {}}
				items={[]}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					preventClickStyle,
					css`${styleObjectToString(componentObj.style)}`
				)} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	type: 'combobox',
	component: AComboBox,
	settingsUI: AComboBoxSettingsUI,
	codeUI: AComboBoxCodeUI,
	keywords: ['combobox', 'filterable', 'multiselect'],
	name: 'ComboBox',
	defaultComponentObj: {
		type: 'combobox',
		placeholder: 'placeholder',
		isMulti: false,
		isInline: false,
		selectionFeedback: 'top-after-reopen',
		direction: 'bottom',
		size: 'md',
		label: 'Label',
		helperText: 'Optional helper text',
		listItems: [
			{
				text: 'Text'
			}
		]
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) =>{
					const name = nameStringToVariableString(json.codeContext?.name);
					const items = json.listItems.map((item: any) => ({
						content: item.text,
						...(json.isMulti && item.selected) && { selected: item.selected }
					}));

					return `@Input() ${name}Label = "${json.label}";
					@Input() ${name}HelperText = "${json.helperText}";
					@Input() ${name}Placeholder = "${json.placeholder}";
					@Input() ${name}Theme = "${json.light ? 'light' : 'dark'}";
					@Input() ${name}Invalid = ${!!json.invalid};
					@Input() ${name}InvalidText = "${json.invalidText ? json.invalidText : ''}";
					@Input() ${name}Size = "${json.size}";
					@Input() ${name}Warn = ${!!json.warn};
					@Input() ${name}WarnText = "${json.warnText ? json.warnText : ''}";
					@Input() ${name}Disabled = ${!!json.disabled};
					@Input() ${name}DropUp = ${json.direction !== 'bottom'};
					@Input() ${name}SelectionFeedback = "${json.selectionFeedback}";
					@Input() ${name}Type: "single" | "multi" = "${json.isMulti ? 'multi' : 'single'}";
					@Input() ${name}Items = ${JSON.stringify(items)};`;
				},
				outputs: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `@Output() ${name}Selected = new EventEmitter<any>();
					@Output() ${name}OnClose = new EventEmitter<any>();
					@Output() ${name}Search = new EventEmitter<string>();`;
				},
				imports: ['ComboBoxModule'],
				code: ({ json }) =>{
					const name = nameStringToVariableString(json.codeContext?.name);
					return `<cds-combo-box
						[label]="${name}Label"
						[helperText]="${name}HelperText"
						[placeholder]="${name}Placeholder"
						[theme]="${name}Theme"
						[invalid]="${name}Invalid"
						[invalidText]="${name}InvalidText"
						[size]="${name}Size"
						[warn]="${name}Warn"
						[warnText]="${name}WarnText"
						[disabled]="${name}Disabled"
						[dropUp]="${name}DropUp"
						[selectionFeedback]="${name}SelectionFeedback"
						[type]="${name}Type"
						[items]="${name}Items"
						(selected)="${name}Selected.emit(event)"
						(search)="${name}Search.emit(event)"
						(close)="${name}OnClose.emit(event)"
						${angularClassNamesFromComponentObj(json)}>
						<cds-dropdown-list></cds-dropdown-list>
					</cds-combo-box>`;
				}
			},
			v10: {
				inputs: ({ json }) =>{
					const name = nameStringToVariableString(json.codeContext?.name);
					const items = json.listItems.map((item: any) => ({
						content: item.text,
						...(json.isMulti && item.selected) && { selected: item.selected }
					}));

					return `@Input() ${name}Label = "${json.label}";
					@Input() ${name}HelperText = "${json.helperText}";
					@Input() ${name}Placeholder = "${json.placeholder}";
					@Input() ${name}Theme = "${json.light ? 'light' : 'dark'}";
					@Input() ${name}Invalid = ${!!json.invalid};
					@Input() ${name}InvalidText = "${json.invalidText ? json.invalidText : ''}";
					@Input() ${name}Size = "${json.size}";
					@Input() ${name}Warn = ${!!json.warn};
					@Input() ${name}WarnText = "${json.warnText ? json.warnText : ''}";
					@Input() ${name}Disabled = ${!!json.disabled};
					@Input() ${name}DropUp = ${json.direction !== 'bottom'};
					@Input() ${name}SelectionFeedback = "${json.selectionFeedback}";
					@Input() ${name}Type: "single" | "multi" = "${json.isMulti ? 'multi' : 'single'}";
					@Input() ${name}Items = ${JSON.stringify(items)};`;
				},
				outputs: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					return `@Output() ${name}Selected = new EventEmitter<any>();
					@Output() ${name}OnClose = new EventEmitter<any>();
					@Output() ${name}Search = new EventEmitter<string>();`;
				},
				imports: ['ComboBoxModule'],
				code: ({ json }) =>{
					const name = nameStringToVariableString(json.codeContext?.name);
					return `<ibm-combo-box
						[label]="${name}Label"
						[helperText]="${name}HelperText"
						[placeholder]="${name}Placeholder"
						[theme]="${name}Theme"
						[invalid]="${name}Invalid"
						[invalidText]="${name}InvalidText"
						[size]="${name}Size"
						[warn]="${name}Warn"
						[warnText]="${name}WarnText"
						[disabled]="${name}Disabled"
						[dropUp]="${name}DropUp"
						[selectionFeedback]="${name}SelectionFeedback"
						[type]="${name}Type"
						[items]="${name}Items"
						(selected)="${name}Selected.emit(event)"
						(search)="${name}Search.emit(event)"
						(close)="${name}OnClose.emit(event)"
						${angularClassNamesFromComponentObj(json)}>
						<ibm-dropdown-list></ibm-dropdown-list>
					</ibm-combo-box>`;
				}
			}
		},
		react: {
			latest: {
				imports: ({ json }) => [json.isMulti ? 'FilterableMultiSelect' : 'ComboBox'],
				code: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					const filterableProps = `${json.isInline ? 'type="inline"': ''}
						${json.hideLabel !== undefined ? `hideLabel={${json.hideLabel}}` : ''}
						${json.selectionFeedback !== 'top-after-reopen' ? `selectionFeedback="${json.selectionFeedback}"`: ''}`;

					// Items are required
					return `<${json.isMulti ? 'FilterableMultiSelect' : 'ComboBox'}
						id="${name}"
						titleText="${json.label}"
						helperText="${json.helperText}"
						placeholder="${json.placeholder}"
						${json.isMulti ? filterableProps : ''}
						${json.direction !== 'bottom' ? `direction="${json.direction}"` : ''}
						${json.light ? `light={${json.light}}` : ''}
						${json.size !== 'md' ? `size="${json.size}"` : ''}
						items={${name}Items}
						itemToString={${name}ItemsToString}
						initialSelectedItem${json.isMulti ? 's' : ''}={${name}DefaultSelected}
						onChange={(selectedItem) => handleInputChange({
							target: {
								name: "${name}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)}
					/>`;
				},
				additionalCode: (json) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					const itemsKey = `${name}Items`;
					const itemsToStringKey = `${name}ItemsToString`;
					const itemsDefaultSelectedKey = `${name}DefaultSelected`;
					return {
						[itemsKey]: `const ${itemsKey} = state["${name}Items"] || ${json.listItems ?
							JSON.stringify(json.listItems) : '[]'};`,
						[itemsToStringKey]: `const ${itemsToStringKey} = state["${name}ItemToString"] || ((item) => (item ? item.text : ""));`,
						[itemsDefaultSelectedKey]: `const ${itemsDefaultSelectedKey} = state["${name}DefaultSelected"] || ${json.isMulti ?
							`(${itemsKey}.filter(item => item.selected))`: `(${itemsKey}.find(item => item.selected))`};`
					};
				}
			},
			v10: {
				imports: ({ json }) => [json.isMulti ? 'FilterableMultiSelect' : 'ComboBox'],
				code: ({ json }) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					const filterableProps = `${json.isInline ? 'type="inline"': ''}
						${json.hideLabel !== undefined ? `hideLabel={${json.hideLabel}}` : ''}
						${json.selectionFeedback !== 'top-after-reopen' ? `selectionFeedback="${json.selectionFeedback}"`: ''}`;

					// Items are required
					return `<${json.isMulti ? 'FilterableMultiSelect' : 'ComboBox'}
						id="${name}"
						titleText="${json.label}"
						helperText="${json.helperText}"
						placeholder="${json.placeholder}"
						${json.isMulti ? filterableProps : ''}
						${json.direction !== 'bottom' ? `direction="${json.direction}"` : ''}
						${json.light ? `light={${json.light}}` : ''}
						${json.size !== 'md' ? `size="${json.size}"` : ''}
						items={${name}Items}
						itemToString={${name}ItemsToString}
						initialSelectedItem${json.isMulti ? 's' : ''}={${name}DefaultSelected}
						onChange={(selectedItem) => handleInputChange({
							target: {
								name: "${name}",
								value: selectedItem
							}
						})}
						${reactClassNamesFromComponentObj(json)}
					/>`;
				},
				additionalCode: (json) => {
					const name = nameStringToVariableString(json.codeContext?.name);
					const itemsKey = `${name}Items`;
					const itemsToStringKey = `${name}ItemsToString`;
					const itemsDefaultSelectedKey = `${name}DefaultSelected`;
					return {
						[itemsKey]: `const ${itemsKey} = state["${name}Items"] || ${json.listItems ?
							JSON.stringify(json.listItems) : '[]'};`,
						[itemsToStringKey]: `const ${itemsToStringKey} = state["${name}ItemToString"] || ((item) => (item ? item.text : ""));`,
						[itemsDefaultSelectedKey]: `const ${itemsDefaultSelectedKey} = state["${name}DefaultSelected"] || ${json.isMulti ?
							`(${itemsKey}.filter(item => item.selected))`: `(${itemsKey}.find(item => item.selected))`};`
					};
				}
			}
		}
	}
};
