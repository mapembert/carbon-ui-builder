import React from 'react';
import { Checkbox, Dropdown, Toggle, TextInput } from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/toggle.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { css, cx } from 'emotion';
import { styleObjectToString } from '@carbon-builder/player-react';

const preventCheckEvent = css`
	pointer-events: none;
`;

export const AToggleSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const sizes = [
		{ id: 'md', text: 'Medium' },
		{ id: 'sm', text: 'Small' }
	];
	return <>
		<Dropdown
			label='Size'
			titleText='Size'
			items={sizes}
			initialSelectedItem={sizes.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
		})}/>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
		<Checkbox
			labelText='Checked'
			id='checked'
			checked={selectedComponent.checked}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					checked: checked
				});
			}}
		/>
		<TextInput
			value={selectedComponent.header}
			labelText='Label text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					header: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.onText}
			labelText='On text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					onText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.offText}
			labelText='Off text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					offText: event.currentTarget.value
				});
			}}
		/>
	</>;
};

export const AToggleCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const AToggle = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Toggle
				size={componentObj.size}
				disabled={componentObj.disabled}
				toggled={componentObj.checked}
				id={componentObj.id}
				labelA={componentObj.offText}
				labelB={componentObj.onText}
				labelText={componentObj.header}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					preventCheckEvent,
					css`${styleObjectToString(componentObj.style)}`
				)} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AToggle,
	settingsUI: AToggleSettingsUI,
	codeUI: AToggleCodeUI,
	keywords: ['toggle'],
	name: 'Toggle',
	type: 'toggle',
	defaultComponentObj: {
		type: 'toggle',
		header: 'Toggle',
		offText: 'Off',
		onText: 'On',
		disabled: false,
		checked: false,
		size: 'md'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Header = "${json.header}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}OnText = "${json.onText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}OffText = "${json.offText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.checked};`,
				outputs: (_) => '',
				imports: ['ToggleModule'],
				code: ({ json }) => {
					return `<cds-toggle
						[label]="${nameStringToVariableString(json.codeContext?.name)}Header"
						[onText]="${nameStringToVariableString(json.codeContext?.name)}OnText"
						[offText]="${nameStringToVariableString(json.codeContext?.name)}OffText"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						[checked]="${nameStringToVariableString(json.codeContext?.name)}Checked"
						${angularClassNamesFromComponentObj(json)}>
					</cds-toggle>`;
				}
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Header = "${json.header}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}OnText = "${json.onText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}OffText = "${json.offText}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Size = "${json.size}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.checked};`,
				outputs: (_) => '',
				imports: ['ToggleModule'],
				code: ({ json }) => {
					return `<ibm-toggle
						[label]="${nameStringToVariableString(json.codeContext?.name)}Header"
						[onText]="${nameStringToVariableString(json.codeContext?.name)}OnText"
						[offText]="${nameStringToVariableString(json.codeContext?.name)}OffText"
						[size]="${nameStringToVariableString(json.codeContext?.name)}Size"
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						[checked]="${nameStringToVariableString(json.codeContext?.name)}Checked"
						${angularClassNamesFromComponentObj(json)}>
					</ibm-toggle>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Toggle'],
				code: ({ json }) => {
					return `<Toggle
						labelText="${json.header}"
						labelA="${json.offText}"
						labelB="${json.onText}"
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.checked ? `toggled={${json.checked}}` : ''}
						size="${json.size}"
						id="${json.codeContext?.name}"
						toggled={state["${json.codeContext?.name}"]?.checked}
						onToggle={(checked) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: checked
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`;
				}
			},
			v10: {
				imports: ['Toggle'],
				code: ({ json }) => {
					return `<Toggle
						labelText="${json.header}"
						labelA="${json.offText}"
						labelB="${json.onText}"
						${json.disabled ? `disabled={${json.disabled}}` : ''}
						${json.checked ? `toggled={${json.checked}}` : ''}
						size="${json.size}"
						id="${json.codeContext?.name}"
						checked={state["${json.codeContext?.name}"]?.checked}
						onToggle={(checked) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: checked
							}
						})}
						${reactClassNamesFromComponentObj(json)} />`;
				}
			}
		}
	}
};
