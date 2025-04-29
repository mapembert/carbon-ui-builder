import React from 'react';
import { ProgressIndicator, ProgressStep } from '@carbon/react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots } from '../common-slots';

export interface ProgressIndicatorState {
	type: string;
	id: string | number;
	progressSteps: {
		label: string;
		invalid?: boolean;
		disabled?: boolean;
		secondaryLabel?: string;
		description?: string;
	}[];
	currentIndex?: number;
	isVertical?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'progress-indicator';

export const slots = {
	...commonSlots
};

export const UIProgressIndicator = ({ state, setState }: {
	state: ProgressIndicatorState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'progress-indicator') {
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

	return <ProgressIndicator
	currentIndex={state.currentIndex || 0}
	vertical={state.isVertical}
	onChange={(selectedStep: number) => setState({ ...state, currentIndex: selectedStep })}
	className={cssClasses}>
		{
			state.progressSteps?.map((step: any) => <ProgressStep
				key={step.label}
				label={step.label}
				invalid={step.invalid}
				disabled={step.disabled}
				secondaryLabel={step.secondaryLabel}
				description={step.description} />)
		}
	</ProgressIndicator>;
};
