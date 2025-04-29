import React, { useContext, useEffect, useState } from 'react';
import {
	Accordion,
	AccordionItem,
	Button,
	InlineLoading,
	Modal
} from '@carbon/react';
import { TrashCan, DataEnrichmentAdd } from '@carbon/icons-react';
import { CustomComponentsCollectionEditor, getNewCustomComponentsCollection } from '@carbon-builder/sdk-react';
import { GithubContext, GlobalStateContext, ModalContext } from '../context';
import { css } from 'emotion';
import { capitalize } from 'lodash';

export const CustomComponentsModal = () => {
	const { customComponentsModal, hideCustomComponentsModal } = useContext(ModalContext);
	const { customComponentsCollections, setCustomComponentsCollections } = useContext(GlobalStateContext);
	const { getFeaturedCustomComponentsCollections } = useContext(GithubContext);

	const [isDeleteOpen, setIsDeleteOpen] = useState({} as any);
	const [featuredCollectionsItems, setFeaturedCollectionsItems] = useState([] as any[]);

	useEffect(() => {
		getFeaturedCustomComponentsCollections().then((value: any) => {
			setFeaturedCollectionsItems(value.map((v: any) => ({
				id: v.name,
				text: capitalize(v.name)
			})));
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!customComponentsCollections || !Array.isArray(customComponentsCollections) || customComponentsCollections.length === 0) {
			setCustomComponentsCollections([getNewCustomComponentsCollection()]);
		}
	}, [customComponentsCollections, setCustomComponentsCollections]);

	return <Modal
		size='lg'
		open={customComponentsModal.isVisible}
		onRequestClose={hideCustomComponentsModal}
		modalHeading='Custom components (Experimental)'
		primaryButtonText='Done'
		onRequestSubmit={() => hideCustomComponentsModal()}>
		{
			(!customComponentsCollections || !Array.isArray(customComponentsCollections) || customComponentsCollections.length === 0)
				? <InlineLoading />
				: <>
					<Accordion className={css`.cds--accordion__content { position: relative; }`}>
						{
							customComponentsCollections.map((collection: any, index: number) =>
								<AccordionItem title={collection.name} key={index}>
									<Button
									kind='danger'
									className={css`position: absolute; right: 0;`}
									onClick={() => setIsDeleteOpen({ ...isDeleteOpen, [collection.name]: true })}
									renderIcon={TrashCan}>
										Delete
									</Button>
									<CustomComponentsCollectionEditor
										key={collection.name}
										collection={collection}
										featuredCollectionsItems={featuredCollectionsItems}
										setCollection={(c: any) => {
											setCustomComponentsCollections([
												...customComponentsCollections.slice(0, index),
												c,
												...customComponentsCollections.slice(index + 1)
											]);
									}} />
									<Modal
									modalHeading='Are you sure you want to delete this?'
									modalLabel='Confirm delete'
									primaryButtonText='Delete'
									secondaryButtonText='Cancel'
									open={!!isDeleteOpen[collection.name]}
									onRequestClose={() => setIsDeleteOpen({ ...isDeleteOpen, [collection.name]: false })}
									onRequestSubmit={() => setCustomComponentsCollections([
										...customComponentsCollections.slice(0, index),
										...customComponentsCollections.slice(index + 1)
									])}>
										{`"${collection.name}" custom components collection`}
									</Modal>
								</AccordionItem>
							)
						}
					</Accordion>
					<Button
					renderIcon={DataEnrichmentAdd}
					onClick={() => {
						setCustomComponentsCollections([...customComponentsCollections, getNewCustomComponentsCollection()]);
					}}>
						Add a collection
					</Button>
				</>
		}
	</Modal>;
};
