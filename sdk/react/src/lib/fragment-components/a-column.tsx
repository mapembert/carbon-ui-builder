import React, { useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	Column,
	NumberInput,
	TextInput
} from '@carbon/react';
import { Add, Help } from '@carbon/react/icons';
import { css, cx } from 'emotion';
import { AComponent } from './a-component';
import { getParentComponent, updatedState } from '../helpers/tools';
import { ComponentInfo } from '.';
import { APlaceholder } from './a-placeholder';
import { styleObjectToString } from '@carbon-builder/player-react';

const helpIconStyle = css`
	color: #525252;
	position: absolute;
	right: 1rem;
	z-index: 1;
	background: white;

	svg {
		width: 1rem;
		height: 1rem;
	}
`;

export const AColumnSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const onNumInputchange = (name: string, value: number) => {
		setComponent({
			...selectedComponent,
			[name]: value
		});
	};

	const [isAccordionOpen, setIsAccordionOpen] = useState({} as any);

	useEffect(() => {
		setIsAccordionOpen({
			small: selectedComponent.smallSpan || selectedComponent.smallOffset,
			medium: selectedComponent.mediumSpan || selectedComponent.mediumOffset,
			large: selectedComponent.largeSpan || selectedComponent.largeOffset,
			xLarge: selectedComponent.xLargeSpan || selectedComponent.xLargeOffset,
			max: selectedComponent.maxSpan || selectedComponent.maxOffset
		});
	}, [selectedComponent]);

	return <>
		<a
		href='https://www.carbondesignsystem.com/guidelines/2x-grid/implementation/'
		target='_blank'
		rel='noopener noreferrer'
		className={helpIconStyle}>
			<Help size={32} />
		</a>
		<Accordion align='start'>
			<AccordionItem title='Small' open={isAccordionOpen.small}>
				<NumberInput
					id='column-small-span-number-input'
					min={0}
					max={4}
					label='Span'
					name='smallSpan'
					value={selectedComponent.smallSpan}
					onChange={((_: any, { value }: any) => onNumInputchange('smallSpan', value))} />
				<NumberInput
					id='column-small-offset-number-input'
					min={0}
					max={3}
					label='Offset'
					name='smallOffset'
					value={selectedComponent.smallOffset}
					onChange={((_: any, { value }: any) => onNumInputchange('smallOffset', value))} />
			</AccordionItem>

			<AccordionItem title='Medium' open={isAccordionOpen.medium}>
				<NumberInput
					id='column-medium-span-number-input'
					min={0}
					max={8}
					label='Span'
					name='mediumSpan'
					value={selectedComponent.mediumSpan}
					onChange={((_: any, { value }: any) => onNumInputchange('mediumSpan', value))} />
				<NumberInput
					id='column-medium-offset-number-input'
					min={0}
					max={7}
					label='Offset'
					name='mediumOffset'
					value={selectedComponent.mediumOffset}
					onChange={((_: any, { value }: any) => onNumInputchange('mediumOffset', value))} />
			</AccordionItem>

			<AccordionItem title='Large' open={isAccordionOpen.large}>
				<NumberInput
					id='column-large-span-number-input'
					min={0}
					max={16}
					label='Span'
					name='largeSpan'
					value={selectedComponent.largeSpan}
					onChange={((_: any, { value }: any) => onNumInputchange('largeSpan', value))} />
				<NumberInput
					id='column-large-offset-number-input'
					min={0}
					max={15}
					label='Offset'
					name='largeOffset'
					value={selectedComponent.largeOffset}
					onChange={((_: any, { value }: any) => onNumInputchange('largeOffset', value))} />
			</AccordionItem>

			<AccordionItem title='Extra large' open={isAccordionOpen.xLarge}>
				<NumberInput
					id='column-x-large-span-number-input'
					min={0}
					max={16}
					label='Span'
					name='xLargeSpan'
					value={selectedComponent.xLargeSpan}
					onChange={((_: any, { value }: any) => onNumInputchange('xLargeSpan', value))} />
				<NumberInput
					id='column-x-large-offset-number-input'
					min={0}
					max={15}
					label='Offset'
					name='xLargeOffset'
					value={selectedComponent.xLargeOffset}
					onChange={((_: any, { value }: any) => onNumInputchange('xLargeOffset', value))} />
			</AccordionItem>

			<AccordionItem title='Max' open={isAccordionOpen.max}>
				<NumberInput
					id='column-max-span-number-input'
					min={0}
					max={16}
					label='Span'
					name='maxSpan'
					value={selectedComponent.maxSpan}
					onChange={((_: any, { value }: any) => onNumInputchange('maxSpan', value))} />
				<NumberInput
					id='column-max-offset-number-input'
					min={0}
					max={15}
					label='Offset'
					name='maxOffset'
					value={selectedComponent.maxOffset}
					onChange={((_: any, { value }: any) => onNumInputchange('maxOffset', value))} />
			</AccordionItem>
		</Accordion>
	</>;
};

const addStyleLeftRight = css`
	position: absolute;
	margin-top: 14px;
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
	z-index: 1;
`;

const addStyleLeft = cx(addStyleLeftRight, css`
	margin-left: -30px;
`);

const addStyleRight = cx(addStyleLeftRight, css`
	margin-left: calc(100% - 30px);
`);

const addStyleTopBottom = css`
	position: absolute;
	margin-left: calc(50% - 10px);
	background: white;
	border: 2px solid #d8d8d8;
	line-height: 21px;
`;

const addStyleTop = cx(addStyleTopBottom, css`
	top: -20px;
`);

const addStyleBottom = cx(addStyleTopBottom, css`
	bottom: -20px;
	z-index: 1;
`);

const iconStyle = css`
	height: 1rem;
	width: 1rem;
	float: right;
	cursor: pointer`;

export const AColumnCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const AColumn = ({
	children,
	componentObj,
	onDrop,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const grandParentComponent = getParentComponent(fragment.data, parentComponent);

	/**
	 * @param offset 0 - add left, 1 - add right
	 */
	const addRow = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'row', items: [
						{ type: 'column', items: [] },
						{ type: 'column', items: [] }
					]
				}
			},
			grandParentComponent.id,
			grandParentComponent.items.indexOf(parentComponent) + offset
		)
	});

	/**
	 * @param offset 0 - add left, 1 - add right
	 */
	const addCell = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'column',
					items: []
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return (
		// position: relative doesn't seem to affect the grid layout and it's needed atm
		// to position right add icon
		<Column
		onDrop={onDrop}
		className={cx(
			componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
			css`position: relative`,
			css`${styleObjectToString(componentObj.style)}`
		)}
		sm={{
			span: componentObj.smallSpan || undefined,
			offset: componentObj.smallOffset || undefined
		}}
		md={{
			span: componentObj.mediumSpan || undefined,
			offset: componentObj.mediumOffset || undefined
		}}
		lg={{
			span: componentObj.largeSpan || undefined,
			offset: componentObj.largeOffset || undefined
		}}
		xlg={{
			span: componentObj.xLargeSpan || undefined,
			offset: componentObj.xLargeOffset || undefined
		}}
		max={{
			span: componentObj.maxSpan || undefined,
			offset: componentObj.maxOffset || undefined
		}}>
			<span className={cx(addStyleTop, selected ? css`` : css`display: none`)}>
				<Add
				size={32}
				onClick={(event: any) => {
					event.stopPropagation();
					addRow();
				}}
				className={iconStyle}/>
			</span>
			<span className={cx(addStyleLeft, selected ? css`` : css`display: none`)}>
				<Add
				size={32}
				onClick={(event: any) => {
					event.stopPropagation();
					addCell();
				}} className={iconStyle}/>
			</span>
			<span className={cx(addStyleRight, selected ? css`` : css`display: none`)}>
				<Add
				size={32}
				onClick={(event: any) => {
					event.stopPropagation();
					addCell(1);
				}} className={iconStyle}/>
			</span>
			<span className={cx(addStyleBottom, selected ? css`` : css`display: none`)}>
				<Add
				size={32}
				onClick={(event: any) => {
					event.stopPropagation();
					addRow(1);
				}} className={iconStyle}/>
			</span>
			<AComponent
			componentObj={componentObj}
			className={css`display: block; height: 100%;`}
			selected={selected}
			fragment={fragment}
			setFragment={setFragment}
			rejectDrop={(dragObj: any) => {
				// don't allow dropping columns directly into other columns
				// row drop handler will take over
				if (dragObj?.component?.type === 'column') {
					return true;
				}

				return false;
			}}
			{...rest}>
				{
					children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
				}
			</AComponent>
		</Column>
	);
};

export const componentInfo: ComponentInfo = {
	component: AColumn,
	codeUI: AColumnCodeUI,
	settingsUI: AColumnSettingsUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <AColumn
		key={componentObj.id}
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
			{componentObj.items.map((column: any) => (
				renderComponents(column, outline)
			))}
	</AColumn>,
	keywords: ['column', 'grid'],
	name: 'Column',
	type: 'column',
	hideFromElementsPane: true,
	defaultComponentObj: undefined,
	image: undefined,
	codeExport: {
		angular: {
			latest: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['GridModule'],
				isNotDirectExport: true,
				code: (_) => ''
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['GridModule'],
				isNotDirectExport: true,
				code: (_) => ''
			}
		},
		react: {
			latest: {
				imports: ['Column'],
				isNotDirectExport: true,
				code: (_) => ''
			},
			v10: {
				imports: ['Column'],
				isNotDirectExport: true,
				code: (_) => ''
			}
		}
	}
};
