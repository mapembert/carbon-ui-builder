import React, { useContext } from 'react';
import { NotificationActionType, NotificationContext } from '../../context/notification-context';
import { Modal } from '@carbon/react';
import { ModalContext } from '../../context/modal-context';
import { GlobalStateContext } from '../../context/global-state-context';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';

import { getFragmentDuplicate } from '../../utils/fragment-tools';

// In the case that fragment modal is used in the dashboard the full fragment containing options and data
// can't be passed in, so fragment id is passed in and `useFragment` is used within this component.
export const FragmentDuplicateModal = () => {
	const {
		fragmentDuplicateModal,
		hideFragmentDuplicateModal
	} = useContext(ModalContext);
	const [, dispatchNotification] = useContext(NotificationContext);
	const { fragments, addFragment } = useContext(GlobalStateContext);

	const navigate: NavigateFunction = useNavigate();
	const location = useLocation();

	const duplicateFragment = () => {
		const fragmentCopy = getFragmentDuplicate(
			fragments,
			fragmentDuplicateModal.fragment,
			// When a new fragment is created from an existing template, it shouldn't
			// be a template by default.
			{ labels: fragmentDuplicateModal.fragment?.labels?.filter((label: string) => label !== 'template') }
		);

		// close all notifications
		dispatchNotification({
			type: NotificationActionType.CLOSE_ALL_NOTIFICATIONS
		});

		addFragment(fragmentCopy);

		if (location.pathname !== '/') {
			navigate(`/edit/${fragmentCopy.id}`);
		}
		dispatchNotification({
			type: NotificationActionType.ADD_NOTIFICATION,
			data: {
				kind: 'success',
				title: 'Duplication success',
				message: `'${fragmentCopy.title}  has been duplicated from '${fragmentDuplicateModal.fragment.title}'.`
			}
		});
		hideFragmentDuplicateModal();
	};

	return (
		<Modal
			size='sm'
			open={fragmentDuplicateModal.isVisible}
			onRequestClose={hideFragmentDuplicateModal}
			secondaryButtonText='Cancel'
			modalHeading='Duplicate fragment?'
			primaryButtonText='Duplicate'
			onRequestSubmit={duplicateFragment}>
			<p>
				Click <strong>Duplicate</strong> to begin to edit a copy of the current fragment
				or <strong>Cancel</strong> to continue on this fragment.
			</p>
		</Modal>
	);
};
