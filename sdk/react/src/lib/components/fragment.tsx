import React, {
	useEffect,
	useRef,
	useState
} from 'react';
import { SkeletonPlaceholder } from '@carbon/react';
import { Add, DropPhoto } from '@carbon/react/icons';
import { css, cx } from 'emotion';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import { throttle } from 'lodash';
import axios from 'axios';
import Handlebars from 'handlebars';
import { getAllFragmentStyleClasses, styleObjectToString } from '@carbon-builder/player-react';
import {
	AComponent,
	allComponents,
	ComponentInfoRenderProps,
	getDropIndex,
	getUsedCollectionsStyleUrls,
	stateWithoutComponent,
	updateComponentCounter,
	updatedState
} from '../../index';
import './fragment-preview.scss';

const canvas = css`
	border: 2px solid #d8d8d8;
	background-color: white;
	position: relative;

	> div {
		height: 100%;
	}
`;

const centerStyle = css`
	height: 100%;
	display: flex;
	align-items: center;
	color: #8d8d8d;
	cursor: pointer;

	> div {
		margin: auto;

		p {
			display: flex;
			line-height: 32px;

			svg {
				margin-right: 0.5rem;
			}
		}
	}
`;

const cornerImageStroke = '#b8b8b8';
const cornerImage = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
	<line x1="0" y1="16" x2="16" y2="0" stroke="${cornerImageStroke}"/>
	<line x1="4" y1="16" x2="16" y2="4" stroke="${cornerImageStroke}"/>
	<line x1="8" y1="16" x2="16" y2="8" stroke="${cornerImageStroke}"/>
	<line x1="12" y1="16" x2="16" y2="12" stroke="${cornerImageStroke}"/>
</svg>`;

const cornerStyle = css`
	position: absolute;
	right: 0;
	bottom: 0;
	width: 16px;
	max-height: 16px;
	background-image: url("data:image/svg+xml,${encodeURIComponent(cornerImage)}");
	cursor: nwse-resize;

	&:hover {
		filter: brightness(60%);
	}
`;

const allowDrop = (event: any) => {
	event.stopPropagation();
	event.preventDefault();
};

const fetchCSS = async (urls: string[]) => {
	try {
		const responses = await Promise.all(
			urls.map((url) => axios.get(url, { responseType: 'text' }))
		);

		const cssContent = responses.map((response) => response.data + '\n').join();

		return css`
			${cssContent}
		`;
	} catch (error) {
		console.error(error);
	}
};

export const Fragment = ({
	fragment,
	setFragment,
	fragments,
	outline,
	remoteCustomComponentsCollections,
	customComponentsCollections,
	styleClasses
}: any) => {
	const [showDragOverIndicator, setShowDragOverIndicator] = useState(false);
	const [customComponentsStyles, setCustomComponentsStyles] = useState(css``);
	const [customComponentsStylesUrls, _setCustomComponentsStylesUrls] = useState<string[]>([]);
	const [allCustomComponentsCollections, setAllCustomComponentsCollections] = useState([] as any[]);
	const containerRef = useRef(null as any);
	const holderRef = useRef(null as any);

	const setCustomComponentsStylesUrls = (ccsUrls: string[]) => {
		// comparing by reference first avoids stringifying in most situations when update isn't needed
		if (
			ccsUrls !== customComponentsStylesUrls
			&& JSON.stringify(ccsUrls) !== JSON.stringify(customComponentsStylesUrls)
		) {
			_setCustomComponentsStylesUrls(ccsUrls);
		}
	};

	// fetch the css from requested urls
	useEffect(() => {
		if (!customComponentsStylesUrls?.length) {
			return;
		}
		fetchCSS(customComponentsStylesUrls).then((value) => setCustomComponentsStyles(css`${value || ''}`));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customComponentsStylesUrls]);

	// update requested urls
	useEffect(() => {
		setCustomComponentsStylesUrls(getUsedCollectionsStyleUrls(allCustomComponentsCollections, fragment.data) || []);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fragment.data, allCustomComponentsCollections]);

	useEffect(() => {
		setAllCustomComponentsCollections([
			...(remoteCustomComponentsCollections as any[] || []).flat(),
			...(customComponentsCollections || [])
		]);
	}, [remoteCustomComponentsCollections, customComponentsCollections]);

	const resize = throttle((e: any) => {
		const rect = containerRef.current.getBoundingClientRect();
		setFragment({
			...fragment,
			width: e.clientX - rect.left,
			height: e.clientY - rect.top
		});
	}, 60);

	const handleMouseUp = () => {
		window.removeEventListener('mousemove', resize);
		window.removeEventListener('mouseup', handleMouseUp);
	};

	const handleMouseDown = (e: any) => {
		e.preventDefault();
		window.addEventListener('mousemove', resize);
		window.addEventListener('mouseup', handleMouseUp);
	};

	if (!fragment || !fragment.data) {
		return <SkeletonPlaceholder />;
	}

	// initialize component counter
	updateComponentCounter(fragment.data);

	const drop = (event: any) => {
		event.stopPropagation();
		event.preventDefault();
		setShowDragOverIndicator(false);

		const dragObj = JSON.parse(event.dataTransfer.getData('drag-object'));

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				dragObj,
				fragment.data.id,
				getDropIndex(event, holderRef.current)
			)
		});
	};

	const select = (componentObj: any) => {
		setFragment({
			...fragment,
			selectedComponentId: componentObj.id
		}, false);
	};

	const remove = (componentObj: any) => {
		setFragment({
			...fragment,
			data: stateWithoutComponent(fragment.data, componentObj.id)
		});
	};

	const addGrid = (event: any) => {
		if (event) {
			event.stopPropagation();
		}

		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				{
					type: 'insert',
					component: allComponents.grid.componentInfo.defaultComponentObj
				}, fragment.data.id, 0
			)
		});
	};

	const renderComponents = (componentObj: any, outline: boolean | null = null): any => {
		if (typeof componentObj === 'string' || !componentObj) {
			return componentObj;
		}

		for (const component of Object.values(allComponents)) {
			// TODO fragment should have overwritable properties
			// overwritten properties are in componentObj in the same level as id, but can go deep, they merge
			//     with subFragment before rendering
			// overwriting happens when you select something in the fragment and change its value (a button to reverse to default?)
			//     default value can be set as placeholder in context?
			// also provide a clone/duplicate functionality/button that essentially copies the
			//     componentObj of subFragment in place in our fragment?
			// JSON export should include json of the subFragment
			if (componentObj.type === component.componentInfo.type) {
				if (component.componentInfo.render) {
					return component.componentInfo.render({
						componentObj,
						select: () => select(componentObj),
						remove: () => remove(componentObj),
						selected: fragment.selectedComponentId === componentObj.id,
						renderComponents,
						outline,
						fragments,
						fragment,
						setFragment
					} as ComponentInfoRenderProps);
				}
				return <component.componentInfo.component
					key={componentObj.id}
					componentObj={componentObj}
					select={() => select(componentObj)}
					remove={() => remove(componentObj)}
					selected={fragment.selectedComponentId === componentObj.id}
					outline={outline}
					fragment={fragment}
					setFragment={setFragment}>
					{componentObj.items && componentObj.items.map((row: any) => renderComponents(row, outline))}
				</component.componentInfo.component>;
			}
		}

		// by the time we're here it wasn't any of the built-in components
		// ///////////////////////////////////////////////
		//        RENDERING CUSTOM COMPONENTS           //
		// ///////////////////////////////////////////////
		if (componentObj.componentsCollection) {
			// our component belongs to one of the custom components collections
			const customComponentsCollection = Array.isArray(allCustomComponentsCollections)
				&& allCustomComponentsCollections?.find((ccc: any) => ccc.name === componentObj.componentsCollection);

			if (customComponentsCollection) {
				const customComponent = customComponentsCollection.components.find((cc: any) => cc.type === componentObj.type);

				if (customComponent?.htmlPreview) {
					// replace the inputs placeholders with values before rendering
					const childrenContainerId = 'children-id-pretty-unique';
					let htmlPreview = customComponent.htmlPreview.split('{{children}}').join(`<div id="${childrenContainerId}"></div>`);

					try {
						htmlPreview = (Handlebars.compile(htmlPreview))(componentObj);
					} catch (_error) {
						console.error(_error);
					}

					const replaceChildren = (
						element: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
						replacement: React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>):
					React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> => {
						if (element.props?.id === childrenContainerId) {
							return replacement;
						}

						if (typeof(element) !== 'object') {
							return element;
						}

						return {
							...element,
							props: {
								...element.props,
								children: Array.isArray(element.props?.children)
									? element.props.children.map((child) => replaceChildren(child, replacement))
									: element.props?.children
							}
						};
					};

					const options = {
						replace: (domNode: any) => {
							// check if the domNode is the root element
							if (domNode.parent === null) {
								const props = attributesToProps(domNode.attribs);

								// add layout and user styles classes
								props.className = `${props.className || ''} ${cx(
									componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
									// getting very div div specific to override artificial specificity
									// brought by importing external css into an emotion style.
									// One div matches specificity and is ok for new edits, but onload
									// external css takes precedence, hence 2
									css`div div & { ${styleObjectToString(componentObj.style)} }`
								)}`;

								const element = React.createElement(domNode.name, props, domToReact(domNode.children));

								const Children = () => <>
									{
										componentObj.items?.map((item: any) => renderComponents(item, outline))
									}
								</>;

								return replaceChildren(element, React.createElement(Children) as any);
							}

							return domNode;
						}
					};

					const html = parse(htmlPreview, options);

					return <AComponent
						componentObj={componentObj}
						select={() => select(componentObj)}
						remove={() => remove(componentObj)}
						selected={fragment.selectedComponentId === componentObj.id}
						outline={outline}
						fragment={fragment}
						setFragment={setFragment}>
						{html}
					</AComponent>;
				}
			}
		}

		if (componentObj.items) {
			return componentObj.items.map((item: any) => renderComponents(item, outline));
		}

		return null;
	};

	const styles = css`${getAllFragmentStyleClasses(fragment, fragments, styleClasses).map((styleClass: any) => `.${styleClass.id} {
			${styleClass.content}
		}`)
	}`;

	return (
		<div
			ref={containerRef}
			className={cx(
				canvas,
				customComponentsStyles,
				css`width: ${fragment.width || '800'}px; height: ${fragment.height || '600'}px`
			)}
			style={{
				background: showDragOverIndicator ? '#0001' : ''
			}}
			onDragEnter={(event) => {
				event.stopPropagation();
				event.preventDefault();
				setShowDragOverIndicator(true);
			}}
			onDragLeave={(event) => {
				event.stopPropagation();
				event.preventDefault();
				setShowDragOverIndicator(false);
			}}
			onDragOver={allowDrop}
			onDrop={drop}>
			<div ref={holderRef} className={cx(styles, `${fragment.cssClasses ? fragment.cssClasses.map((cc: any) => cc.id).join(' ') : ''}`)}>
				{
					!fragment.data?.items?.length && <div className={centerStyle} onClick={addGrid}>
						<div>
							<p><Add size={32} /> Click to add grid <br /></p>
							<p><DropPhoto size={32} /> Drag and drop an element from the left pane to get started</p>
						</div>
					</div>
				}
				{renderComponents(fragment.data, outline)}
			</div>
			<div
				className={cornerStyle}
				onMouseDown={handleMouseDown} />
		</div>
	);
};
