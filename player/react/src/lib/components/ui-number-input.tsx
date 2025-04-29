import React from 'react';
import { NumberInput } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface NumberInputState {
	type: string;
	id: string | number;
	value?: number;
	size?: string;
	helperText?: string;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	warnText?: string;
	warn?: boolean;
	hideLabel?: boolean;
	hideSteppers?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	invalidText?: string;
	light?: boolean;
	allowEmpty?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'number-input';

export const signals = ['change'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	value: 'number',
	min: 'number',
	max: 'number',
	step: 'number',
	label: 'string',
	warnText: 'string',
	warn: 'boolean',
	hideLavel: 'boolean',
	hideSteppers: 'boolean',
	readOnly: 'boolean',
	invalid: 'boolean',
	invalidText: 'string',
	allowEmpty: 'boolean'
};

export const UINumberInput = ({ state, sendSignal }: {
	state: NumberInputState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'number-input') {
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

	return <NumberInput
		id={state.id}
		name={state.codeContext?.name}
		value={state.value}
		size={state.size}
		helperText={state.helperText}
		min={state.min}
		max={state.max}
		step={state.step}
		label={state.label}
		warnText={state.warnText}
		warn={state.warn}
		hideLabel={state.hideLabel}
		hideSteppers={state.hideSteppers}
		disabled={state.disabled}
		readOnly={state.readOnly}
		invalid={state.invalid}
		invalidText={state.invalidText}
		light={state.light}
		allowEmpty={state.allowEmpty}
		onChange={(_: any, { value }: any) => sendSignal(state.id, 'change', [value], { ...state, value })}
		className={cssClasses} />;
};
