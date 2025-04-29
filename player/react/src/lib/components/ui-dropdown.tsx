import React from 'react';
import { Dropdown, MultiSelect } from '@carbon/react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface DropdownState {
	type: string;
	placeholder: string;
	id: string | number;
	hidden?: boolean;
	listItems?: any[];
	light?: boolean;
	invalid?: boolean;
	invalidText?: string;
	isMulti?: boolean;
	isInline?: boolean;
	warn?: boolean;
	warnText?: string;
	disabled?: boolean;
	hideLabel?: boolean;
	direction?: string;
	size?: string;
	label?: string;
	selectedItem?: any;
	helperText?: string;
	itemToString?: (item: any) => string;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'dropdown';

export const slots = {
	...commonSlots,
	...slotsDisabled
};

export const UIDropdown = ({ state, setState }: {
	state: DropdownState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'dropdown') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	let cssClasses = state.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (state.style) {
		if (cssClasses.length > 0) {
			cssClasses += ' ';
		}
		cssClasses += stringToCssClassName(state.codeContext.name);
	}

	const DropdownOrMulti = state.isMulti ? MultiSelect : Dropdown;

	return <DropdownOrMulti
		id={state.codeContext?.name}
		items={state.listItems}
		label={state.placeholder}
		selectedItem={state.selectedItem}
		titleText={state.label}
		size={state.size}
		light={state.light}
		disabled={state.disabled}
		helperText={state.helperText}
		type={state.isInline ? 'inline' : undefined}
		warn={state.warn}
		warnText={state.warnText}
		hideLabel={state.hideLabel}
		invalid={state.invalid}
		invalidText={state.invalidText}
		direction={state.direction}
		itemToString={state.itemToString || ((item) => item.text || '')}
		onChange={(selectedItem: any) => setState({
			...state,
			selectedItem: state.listItems?.find((item) => item.text === selectedItem.text)
		})}
		className={cssClasses} />;
};
