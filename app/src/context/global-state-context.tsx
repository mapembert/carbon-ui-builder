import React, {
	createContext,
	useEffect,
	useContext,
	useState
} from 'react';
import assign from 'lodash/assign';
import { getFragmentHelpers } from './fragments-context-helper';
import {
	getCustomComponentsCollectionsFromLocalStorage,
	getFragmentsFromLocalStorage
} from '../utils/fragment-tools';
import { expandJsonToState } from '@carbon-builder/player-react';
import { getFragmentJsonExport as getFragmentJsonExport_, CURRENT_MODEL_VERSION, updateModelInPlace } from '@carbon-builder/sdk-react';

const GlobalStateContext: React.Context<any> = createContext(null);
GlobalStateContext.displayName = 'GlobalStateContext';

export const useFragment = (id?: string) => {
	const context = useContext(GlobalStateContext);

	if (!context) {
		// this happens when rendering, which is fine because it's used
		// in AComponent to update the state of the whole fragment due to
		// user interaction - functionality not needed for render only
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		return [{}, (_: any) => { }];
	}

	const { fragments, updateFragment } = context;

	if (!id) {
		const pathSegments = window.location.pathname.split('/');
		id = pathSegments[pathSegments.length - 1];
	}

	const fragment = fragments.find((fragment: any) => fragment.id === id);
	const setFragment = (fragment: any, updateActionHistory = true) => {
		updateFragment(fragment, updateActionHistory);
	};
	return [fragment, setFragment];
};

const GlobalStateContextProvider = ({ children }: any) => {
	const [fragments, _setFragments] = useState<any[]>(getFragmentsFromLocalStorage());
	const [actionHistory, setActionHistory] = useState([] as any[]);
	const [actionHistoryIndex, setActionHistoryIndex] = useState(-1);

	const [styleClasses, _setStyleClasses] = useState(JSON.parse(localStorage.getItem('globalStyleClasses') as string || '[]') as any[]);
	const [customComponentsCollections, _setCustomComponentsCollections] = useState<any[]>(getCustomComponentsCollectionsFromLocalStorage());
	const [settings, _setSettings] = useState(JSON.parse(localStorage.getItem('globalSettings') as string || '{}') as any);

	const [githubToken, _setGithubToken] = useState(localStorage.getItem('githubToken') as string || '');

	const setFragments = (frags: any[]) => {
		_setFragments(frags);
		localStorage.setItem('localFragments', JSON.stringify(frags));
	};

	const addAction = (action: any) => {
		const newActionHistoryIndex = actionHistoryIndex + 1;
		setActionHistoryIndex(newActionHistoryIndex);

		const actionClone = JSON.parse(JSON.stringify(action));

		setActionHistory([...actionHistory.slice(0, newActionHistoryIndex), actionClone]);
	};

	const setStyleClasses = (sc: any, updateActionHistory = true) => {
		const csString = JSON.stringify(sc);
		localStorage.setItem('globalStyleClasses', csString);
		_setStyleClasses(sc);
		if (updateActionHistory) {
			addAction({
				styleClasses: JSON.parse(csString)
			});
		}
	};

	const setCustomComponentsCollections = (ccc: any) => {
		const cccString = JSON.stringify(ccc);
		localStorage.setItem('customComponentsCollections', cccString);
		_setCustomComponentsCollections(ccc);
	};

	const setGithubToken = (token: string) => {
		localStorage.setItem('githubToken', token);
		_setGithubToken(token);
	};

	const setSettings = (sc: any) => {
		const csString = JSON.stringify(sc);
		localStorage.setItem('globalSettings', csString);
		_setSettings(sc);
	};

	const canUndo = () => actionHistoryIndex > 0;

	const updateFragment = (fragment: any, updateActionHistory = true) => {
		const fragmentToUpdate = {
			...fragment,
			lastModified: new Date().toISOString()
		};
		if (!fragments.length) {
			setFragments([fragmentToUpdate]);
			return;
		}
		const updatedFragments = fragments.map((f: any) => {
			if (f.id === fragmentToUpdate.id) {
				// Cannot use merge because removing datasets or labels will not
				// work since it keeps the values, while assign overwrites past values.
				return assign({}, f, fragmentToUpdate);
			}
			return f;
		});

		setFragments(updatedFragments);

		if (updateActionHistory) {
			addAction({ fragment: fragmentToUpdate });
		}
	};

	const setAction = (newIndex: number) => {
		if (newIndex < 0 || newIndex > actionHistory.length - 1) {
			return;
		}

		const action = actionHistory[newIndex];
		// if there was a change in fragment
		if (action.fragment) {
			updateFragment(action.fragment, false);
		}

		// if there was a change in styleClasses
		if (action.styleClasses) {
			setStyleClasses(action.styleClasses, false);
		}

		setActionHistoryIndex(newIndex);
	};

	const undoAction = () => {
		if (!canUndo()) {
			return;
		}

		setAction(actionHistoryIndex - 1);
	};

	const canRedo = () => actionHistoryIndex < actionHistory.length - 1;

	const redoAction = () => {
		if (!canRedo()) {
			return;
		}

		setAction(actionHistoryIndex + 1);
	};

	const clearActionHistory = () => {
		setActionHistoryIndex(-1);
		setActionHistory([]);
	};

	const fragmentHelpers = getFragmentHelpers({ fragments, setFragments });

	const getFragmentJsonExport = (fragment: any) => {
		return getFragmentJsonExport_(fragment, fragments, styleClasses);
	};

	const getExpandedFragmentState = (fragment: any) => {
		return expandJsonToState(getFragmentJsonExport(fragment));
	};

	useEffect(() => {
		const localFragments = JSON.parse(localStorage.getItem('localFragments') as string || '[]');
		// clean up the hidden fragments (those marked for deletion but failed to be deleted)
		const filteredFragments = localFragments.filter((fragment: any) => !fragment.hidden);
		// Check version & migrate if needed! Update in place before it is set in state
		filteredFragments.forEach((frag: any) => {
			if (frag.version !== CURRENT_MODEL_VERSION) {
				updateModelInPlace(frag);
			}
		});

		fragmentHelpers.updateFragments(filteredFragments);
		localStorage.setItem('localFragments', JSON.stringify(filteredFragments));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<GlobalStateContext.Provider value={{
			// FRAGMENTS
			fragments,
			setFragments,
			updateFragment,
			getFragmentJsonExport,
			getExpandedFragmentState,
			...fragmentHelpers,

			// STYLE CLASSES
			styleClasses,
			setStyleClasses,

			// CUSTOM COMPONENTS COLLECTIONS
			customComponentsCollections,
			setCustomComponentsCollections,

			// SETTINGS
			settings,
			setSettings,

			// ACTION HISTORY
			actionHistory,
			actionHistoryIndex,
			setActionHistory,
			setActionHistoryIndex,
			addAction,
			canUndo,
			undoAction,
			canRedo,
			redoAction,
			clearActionHistory,

			// GITHUB TOKENS
			githubToken,
			setGithubToken
		}}>
			{children}
		</GlobalStateContext.Provider>
	);
};

export {
	GlobalStateContext,
	GlobalStateContextProvider
};
