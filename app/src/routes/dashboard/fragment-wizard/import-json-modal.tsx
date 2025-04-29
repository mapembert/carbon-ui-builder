import React, { useCallback, useContext, useEffect, useState } from 'react';

import { css } from 'emotion';
import {
	Modal,
	FormItem,
	FileUploaderDropContainer,
	FileUploaderItem,
	TextArea,
	InlineNotification
} from '@carbon/react';
import { FragmentWizardModals } from './fragment-wizard';
import { generateNewFragment } from './generate-new-fragment';

import { GlobalStateContext, NotificationActionType, NotificationContext } from '../../../context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { CURRENT_MODEL_VERSION, updateModelInPlace } from '@carbon-builder/sdk-react';

const fragmentOptions = css`
	margin-left: 30px;
	margin-right: 30px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;

	// This is the viewport width that causes the selection tiles to overlap.
	@media screen and (max-width: 45rem) {
		flex-direction: column;
	}
`;

const notificationStyle = css`
	margin-bottom: 1rem;
`;

export interface ImportJsonModalProps {
	shouldDisplay: boolean;
	setShouldDisplay: (shouldDisplay: boolean) => void;
	setDisplayedModal: (displayedModal: FragmentWizardModals | null) => void;
	setLastVisitedModal: (lastVisitedModal: FragmentWizardModals) => void;
	lastVisitedModal: FragmentWizardModals;
	uploadedData: any;
	setUploadedData: (uploadedData: any) => void;
	multiple?: boolean;
}

let lastId = 0;

const uid = (prefix = 'id') => {
	lastId++;
	return `${prefix}${lastId}`;
};

export const ImportJsonModal = (props: ImportJsonModalProps) => {
	const { addFragment, styleClasses, setStyleClasses } = useContext(GlobalStateContext);
	const [, dispatchNotification] = useContext(NotificationContext);
	const [files, setFiles] = useState([] as any[]);
	const [jsonString, _setJsonString] = useState('');
	const [fragmentJson, setFragmentJson] = useState<any>({});
	const [jsonParseError, setJsonParseError] = useState('');
	const [modelMismatchNotification, setModelMismatchNotification] = useState(false);

	const setJsonString = (js: string) => {
		_setJsonString(js);

		try {
			if (js) {
				const parsedJSON = JSON.parse(js);
				setFragmentJson(parsedJSON);

				// Check if fragment with microlayout is imported
				if (Array.isArray(parsedJSON) && parsedJSON.some((fragment: any) => fragment.version !== CURRENT_MODEL_VERSION)) {
					setModelMismatchNotification(true);
				} else if (!Array.isArray(parsedJSON) && parsedJSON.version !== CURRENT_MODEL_VERSION) {
					setModelMismatchNotification(true);
				} else {
					setModelMismatchNotification(false);
				}
			} else {
				setModelMismatchNotification(false);
			}

			setJsonParseError('');
		} catch (e) {
			setJsonParseError((e as any).toString());
		}
	};

	const handleDrop = (e: any) => {
		e.preventDefault();
	};

	const handleDragover = (e: any) => {
		e.preventDefault();
	};

	useEffect(() => {
		document.addEventListener('drop', handleDrop);
		document.addEventListener('dragover', handleDragover);
		return () => {
			document.removeEventListener('drop', handleDrop);
			document.removeEventListener('dragover', handleDragover);
		};
	}, []);

	const navigate: NavigateFunction = useNavigate();
	const uploadFile = async (fileToUpload: any) => {
		// file size validation
		if (fileToUpload.filesize > 512000) {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file',
				invalid: true,
				errorSubject: 'File size exceeds limit',
				errorBody: '500kb max file size. Select a new file and try again.'
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
			return;
		}

		// file type validation
		if (fileToUpload.invalidFileType) {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file',
				invalid: true,
				errorSubject: 'Invalid file type',
				errorBody: `"${fileToUpload.name}" does not have a valid file type.`
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
			return;
		}

		// reading
		const reader = new FileReader();
		reader.readAsText(fileToUpload.file, 'UTF-8');
		reader.onload = (event) => {
			setJsonString(event.target?.result as string);
		};
		reader.onerror = function (_) {
			console.log('oops');
		};

		const updatedFile = {
			...fileToUpload,
			status: 'complete',
			iconDescription: 'Upload complete'
		};
		setFiles((files) =>
			files.map((file) =>
				file.uuid === fileToUpload.uuid ? updatedFile : file
			)
		);

		// show x icon after 1 second
		setTimeout(() => {
			const updatedFile = {
				...fileToUpload,
				status: 'edit',
				iconDescription: 'Delete file'
			};
			setFiles((files) =>
				files.map((file) =>
					file.uuid === fileToUpload.uuid ? updatedFile : file
				)
			);
		}, 1000);
	};

	const onAddFiles = useCallback(
		(evt: any, { addedFiles }: any) => {
			evt.stopPropagation();
			const newFiles = addedFiles.map((file: any) => ({
				uuid: uid(),
				file: file,
				name: file.name,
				filesize: file.size,
				status: 'uploading',
				iconDescription: 'Uploading',
				invalidFileType: file.invalidFileType
			}));
			// eslint-disable-next-line react/prop-types
			if (props.multiple) {
				setFiles([...files, ...newFiles]);
				newFiles.forEach(uploadFile);
			} else if (newFiles[0]) {
				setFiles([newFiles[0]]);
				uploadFile(newFiles[0]);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[files, props.multiple]
	);

	const handleFileUploaderItemClick = useCallback(
		(_: any, { uuid: clickedUuid }: any) =>
			setFiles(files.filter(({ uuid }) => clickedUuid !== uuid)),
		[files]
	);

	const generateFragment = (fragmentList: any[]) => {
		const generatedFragmentList = fragmentList.map((fragment) => generateNewFragment(fragment, styleClasses, setStyleClasses));

		// close all notifications
		dispatchNotification({
			type: NotificationActionType.CLOSE_ALL_NOTIFICATIONS
		});

		addFragment(generatedFragmentList);

		// go to new fragment, fragment[0] consumes preceding fragments in list (microlayout)
		navigate(`/edit/${generatedFragmentList[0].id}`);
	};

	return (
		<Modal
			open={props.shouldDisplay}
			shouldSubmitOnEnter={false}
			selectorPrimaryFocus='.cds--tile--selectable'
			onRequestSubmit={() => {
				// Check if input is an array to see if JSON consists of a micro layout
				const fragmentList = Array.isArray(fragmentJson) ? fragmentJson : [fragmentJson];

				// Updates models in place before entering edit mode
				fragmentList.forEach(fragment => updateModelInPlace(fragment));
				setFragmentJson(fragmentList);

				generateFragment(fragmentList);
				props.setLastVisitedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
				props.setDisplayedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
				props.setShouldDisplay(false);
			}}
			onRequestClose={() => {
				props.setLastVisitedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
				props.setDisplayedModal(FragmentWizardModals.CREATE_FRAGMENT_MODAL);
				props.setShouldDisplay(false);
			}}
			onSecondarySubmit={() => {
				props.setDisplayedModal(props.lastVisitedModal);
				props.setLastVisitedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
			}}
			modalHeading='Import JSON'
			primaryButtonText='Done'
			primaryButtonDisabled={!jsonString || jsonParseError}
			secondaryButtonText='Back'>
			<div className={fragmentOptions}>
				{
					modelMismatchNotification &&
					<InlineNotification
						className={notificationStyle}
						kind='warning'
						lowContrast={true}
						hideCloseButton
						statusIconDescription='notification'
						title='Model version is outdated and will be migrated in the import process.' />
				}
				<FormItem>
					<p className='cds--file--label'>Upload file</p>
					<p className='cds--label-description'>
						Max file size is 500kb. Supported file type is .json
					</p>
					<FileUploaderDropContainer accept={['.json']} onAddFiles={onAddFiles} />
					<div className={'cds--file-container'} style={{ width: '100%' }}>
						{files.map(
							({
								uuid,
								name,
								filesize,
								status,
								iconDescription,
								invalid,
								...rest
							}) => (
								<FileUploaderItem
									key={uid()}
									{...rest}
									uuid={uuid}
									name={name}
									filesize={filesize}
									// eslint-disable-next-line react/prop-types
									size={500}
									status={status}
									iconDescription={iconDescription}
									invalid={invalid}
									onDelete={handleFileUploaderItemClick}
								/>
							)
						)}
					</div>
				</FormItem>
				<code style={{ color: '#a00', marginBottom: '10pt', width: '100%' }}>
					<pre>{jsonParseError}</pre>
				</code>
				<TextArea
					labelText='JSON to load'
					placeholder="{'your': 'json', 'goes': 'here'}"
					helperText=''
					value={jsonString}
					onChange={(event: any) => setJsonString(event.target.value)}
				/>
			</div>
		</Modal>
	);
};
