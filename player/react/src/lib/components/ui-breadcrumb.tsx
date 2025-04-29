import React from 'react';
import { Breadcrumb } from '@carbon/react';
import { CssClasses } from '../types';
import { BreadcrumbItemState } from './ui-breadcrumb-item';
import {
	renderComponents,
	setItemInState,
	stringToCssClassName
} from '../utils';
import { commonSlots } from '../common-slots';

export interface BreadcrumbState {
	type: string;
	items: BreadcrumbItemState[];
	id: string | number;
	hidden?: boolean;
	noTrailingSlash?: boolean;
	cssClasses?: CssClasses[];
	codeContext: {
		name: string;
	};
	style?: any;
}

export const type = 'breadcrumb';

export const slots = {
	...commonSlots
};

export const UIBreadcrumb = ({ state, setState, setGlobalState, sendSignal }: {
	state: BreadcrumbState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'breadcrumb') {
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

	return <Breadcrumb
	noTrailingSlash={state.noTrailingSlash}
	className={cssClasses}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</Breadcrumb>;
};
