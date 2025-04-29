import React from 'react';
import { TileBelowTheFoldContent } from '@carbon/react';
import { CssClasses } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { commonSlots } from '../common-slots';

export interface TileFoldState {
	type: string;
	items?: any[];
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const type = 'tile-fold';

export const slots = {
	...commonSlots
};

export const UITileFold = ({ state, setState, setGlobalState, sendSignal }: {
	state: TileFoldState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'tile-fold') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <TileBelowTheFoldContent
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{
			state.items?.map((item: any) => {
				const setItem = (i: any) => setItemInState(i, state, setState);
				return renderComponents(item, setItem, setGlobalState, sendSignal);
			})
		}
	</TileBelowTheFoldContent>;
};
