import React from 'react';
import { Loading } from '@carbon/react';
import { CssClasses } from '../types';
import { stringToCssClassName } from '../utils';
import { commonSlots } from '../common-slots';

export interface LoadingState {
	type: string;
	id: string | number;
	size?: string;
	active?: boolean;
	overlay?: boolean;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'loading';

export const slots = {
	...commonSlots,
	active: 'boolean',
	overlay: 'boolean'
};

export const UILoading = ({ state }: {
	state: LoadingState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'loading') {
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

	return <Loading
		active={state.active}
		withOverlay={state.overlay}
		small={state.size === 'small'}
		name={state.codeContext?.name}
		className={cssClasses} />;
};
