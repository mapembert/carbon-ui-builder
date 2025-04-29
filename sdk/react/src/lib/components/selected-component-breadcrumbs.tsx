import React from 'react';

import { Breadcrumb, BreadcrumbItem } from '@carbon/react';

import { css } from 'emotion';
import { getParentComponent, getSelectedComponent } from '../..';

const getAncestors = (state: any, component: any) => {
	const ancestors: any[] = [];

	// there's probably a way to optimize this function

	if (state === component) {
		return ancestors;
	}

	let parent = component;

	do {
		parent = getParentComponent(state, parent);
		ancestors.unshift(parent);
	} while (parent !== state);

	return ancestors;
};

export const SelectedComponentBreadcrumbs = ({ selectedComponent, fragment, setFragment }: any) => {
	if (!selectedComponent) {
		selectedComponent = getSelectedComponent(fragment);
	}

	const selectComponent = (component: any) => {
		setFragment({
			...fragment,
			selectedComponentId: component.id
		}, false);
	};

	return selectedComponent && <Breadcrumb className={css`padding: 1rem`} noTrailingSlash>
		{getAncestors(fragment.data, selectedComponent).map((component) =>
			<BreadcrumbItem
			href='#'
			key={component.id}
			onClick={(event: any) => {
				event.nativeEvent.preventDefault();
				if (!component.type) {
					// happens when clicking root element
					// we select the fragment
					selectComponent({ id: null });
					return;
				}
				selectComponent(component);
			}}>
				{component.type || 'fragment'}
			</BreadcrumbItem>
		)}
		<BreadcrumbItem href='#' onClick={(event: any) => event.nativeEvent.preventDefault()} isCurrentPage>
			{selectedComponent.type || 'container'}
		</BreadcrumbItem>
	</Breadcrumb>;
};
