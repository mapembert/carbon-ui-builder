import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	OverflowMenu,
	OverflowMenuItem,
	SkeletonText,
	Tile
} from '@carbon/react';
import {
	Copy,
	DocumentExport,
	Edit,
	View,
	TrashCan
} from '@carbon/react/icons';
import { css } from 'emotion';
import { ModalContext } from '../../context/modal-context';
import { FragmentPreview } from '@carbon-builder/sdk-react';
import './fragment-tile.scss';
import { GlobalStateContext } from '../../context';

const menuItemStyle = css`
	display: flex;
	align-items: center;

	svg {
		margin-right: 0.5rem;
	}
`;

const clickableStyle = css`
	cursor: pointer;
`;

export const FragmentTile = ({
	fragment,
	fragments,
	title,
	to,
	lastModified,
	isFeaturedFragment
}: any) => {
	const navigate = useNavigate();
	const { styleClasses, fragments: allFragments } = useContext(GlobalStateContext);
	const {
		showFragmentDuplicateModal,
		showFragmentDeleteModal,
		showFragmentExportModal,
		showFragmentPreviewModal
	} = useContext(ModalContext);
	const resetPreview = useRef(null);

	return (
		<div className='tile-wrapper'>
			<Tile className='tile-style' >
				<div className='tile-inner-wrapper'>
					{
						isFeaturedFragment
						? <section
						className={clickableStyle}
						onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)}>
							<FragmentPreview fragment={fragment} fragments={allFragments} styleClasses={styleClasses} resetPreview={resetPreview} />
						</section>
						: <Link to={to}>
							<FragmentPreview fragment={fragment} fragments={allFragments} styleClasses={styleClasses} resetPreview={resetPreview} />
						</Link>
					}

					<div className='fragment-info'>
						<div>
							{
								isFeaturedFragment
								? <section
								className={clickableStyle}
								onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)}>
									<h3>{title}</h3>
								</section>
								: <Link to={to} className='dashboard-link'>
									<h3>{title}</h3>
								</Link>
							}
							<span>{lastModified ? lastModified : 'Last modified date unknown'}</span>
						</div>
						<span className='fragment-overflow'>
							<OverflowMenu
							ariaLabel='Fragment options'
							iconDescription='Fragment options'
							onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}>
								{
									!isFeaturedFragment && <OverflowMenuItem
										itemText={<div className={menuItemStyle}><Edit size={16} /> Edit</div>}
										onClick={() => navigate(`/edit/${fragment.id}`)} />
								}
								<OverflowMenuItem
									itemText={<div className={menuItemStyle}><DocumentExport size={16} /> Export</div>}
									onClick={() => showFragmentExportModal(fragment)} />
								<OverflowMenuItem
									itemText={<div className={menuItemStyle}><Copy size={16} /> Duplicate</div>}
									onClick={() => showFragmentDuplicateModal(fragment)} />
								<OverflowMenuItem
									itemText={<div className={menuItemStyle}><View size={16} /> Open preview</div>}
									onClick={() => showFragmentPreviewModal(fragment, fragments, isFeaturedFragment)} />
								<OverflowMenuItem
									itemText={<div className={menuItemStyle}><TrashCan size={16} /> Delete</div>}
									onClick={() => showFragmentDeleteModal(fragment.id)}
									isDelete />
							</OverflowMenu>
						</span>
					</div>
				</div>
			</Tile>
		</div>
	);
};

export const SkeletonFragmentTile = () => (
	<div className='tile-wrapper'>
		<Tile>
			<div className='tile-inner-wrapper-base'>
				<SkeletonText heading width='150px' />
			</div>
		</Tile>
	</div>
);
