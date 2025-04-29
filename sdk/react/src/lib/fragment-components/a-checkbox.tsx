import React from 'react';
import { Checkbox, TextInput } from '@carbon/react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/checkbox.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const ACheckboxSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}} />
		<Checkbox
			labelText='Checked'
			id='checkbox-checked'
			checked={selectedComponent.checked}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				checked
			})} />
	</>;
};

export const ACheckboxCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				name: event.currentTarget.value
			}
		});
	}} />;

export const ACheckbox = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		rejectDrop={true}
		{...rest}>
			<Checkbox
				kind={componentObj.kind}
				disabled={componentObj.disabled}
				labelText={componentObj.label}
				checked={componentObj.checked}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ACheckbox,
	settingsUI: ACheckboxSettingsUI,
	codeUI: ACheckboxCodeUI,
	keywords: ['checkbox', 'check box'],
	name: 'Checkbox',
	type: 'checkbox',
	defaultComponentObj: {
		type: 'checkbox',
		label: 'Checkbox'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${!!json.checked};`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}CheckedChange = new EventEmitter<boolean>();`,
				imports: ['CheckboxModule'],
				code: ({ json }) => {
					return `<cds-checkbox
						name="${json.codeContext?.name}"
						id="${json.codeContext?.name}"
						[(checked)]="${nameStringToVariableString(json.codeContext?.name)}Checked"
						(checkedChange)="${nameStringToVariableString(json.codeContext?.name)}CheckedChange.emit($event)"
						${angularClassNamesFromComponentObj(json)}>
							${json.label}
					</cds-checkbox>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${!!json.checked};`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}CheckedChange = new EventEmitter<boolean>();`,
				imports: ['CheckboxModule'],
				code: ({ json }) => {
					return `<ibm-checkbox
						name="${json.codeContext?.name}"
						id="${json.codeContext?.name}"
						[(checked)]="${nameStringToVariableString(json.codeContext?.name)}Checked"
						(checkedChange)="${nameStringToVariableString(json.codeContext?.name)}CheckedChange.emit($event)"
						${angularClassNamesFromComponentObj(json)}>
							${json.label}
					</ibm-checkbox>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Checkbox'],
				code: ({ json }) => {
					return `<Checkbox
						labelText="${json.label}"
						name="${json.codeContext?.name}"
						id="${json.codeContext?.name}"
						checked={state["${json.codeContext?.name}"]?.checked}
						${reactClassNamesFromComponentObj(json)}
						onChange={(_, { checked }) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: checked
							}
						})} />`;
				}
			},
			v10: {
				imports: ['Checkbox'],
				code: ({ json }) => {
					return `<Checkbox
						labelText="${json.label}"
						name="${json.codeContext?.name}"
						id="${json.codeContext?.name}"
						checked={state["${json.codeContext?.name}"]?.checked}
						${reactClassNamesFromComponentObj(json)}
						onChange={(checked) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: checked
							}
						})} />`;
				}
			}
		}
	}
};
