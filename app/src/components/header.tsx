import React, { useContext, useState } from 'react';
import {
	HeaderMenu,
	HeaderMenuItem,
	HeaderNavigation,
	HeaderName,
	HeaderGlobalAction,
	HeaderGlobalBar,
	HeaderPanel,
	Header as ShellHeader,
	SkipToContent,
	Switcher,
	SwitcherItem,
	Tooltip
} from '@carbon/react';
import {
	ChatLaunch,
	Debug,
	DocumentAdd,
	Download,
	DocumentImport,
	DocumentExport,
	FolderDetails,
	Information,
	Keyboard,
	LogoGithub,
	UserAvatar,
	Help,
	Warning
} from '@carbon/react/icons';
import { css } from 'emotion';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { FragmentWizardModals } from '../routes/dashboard/fragment-wizard/fragment-wizard';
import { saveBlob } from '../utils/file-tools';
import { GlobalStateContext } from '../context';
import { ModalContext } from '../context/modal-context';
import { getEditScreenParams } from '../utils/fragment-tools';
import { UserContext } from '../context/user-context';
import { getFragmentJsonExportString } from '@carbon-builder/sdk-react';

const dividerStyle = css`
	margin: 2px 1rem;
	height: 1px;
	background-color: gray;
	width: calc(100% - 2rem);
`;

const headerName = css`
	&:hover {
		cursor: pointer;
	}

	.cds--text-truncate--end {
		display: inline-flex;

		svg {
			margin-right: 0.5rem;
		}
	}
`;

const headerStyle = css`
	z-index: 8001;
`;

const headerNavStyle = css`
	display: block;
`;

const profileImageStyle = css`
	width: 2rem;
	border-radius: 1rem;
	border: 2px solid lightgray;
`;

const switcherItemWithIconStyle = css`
	a {
		display: flex;
	}

	svg {
		margin-right: 0.5rem;
	}
`;

const itemSeparatorStyle = css`
	width: calc(100% - 2rem);
	height: 1px;
	background-color: #c6c6c6;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
`;

export const Header = ({
	setDisplayedModal,
	displayWizard,
	setDisplayWizard
}: any) => {
	const navigate: NavigateFunction = useNavigate();
	const globalState = useContext(GlobalStateContext);
	const user = useContext(UserContext);
	const modalContext = useContext(ModalContext);
	const [userMenuVisible, setUserMenuVisible] = useState(false);
	const params = getEditScreenParams();
	const fragment = globalState?.fragments.find((fragment: any) => fragment.id === params?.id);

	return (
		<ShellHeader
		aria-label='IBM Carbon UI Builder'
		role='banner'
		tabIndex={0}
		className={headerStyle}>
			<SkipToContent />
			<HeaderName
				prefix='IBM'
				tabIndex={0}
				title='Carbon UI Builder home'
				className={headerName}
				onClick={() => navigate('/')}
				onKeyDown={(event: any) => event.key === 'Enter' && navigate('/')}>
				Carbon UI Builder {process.env.NODE_ENV === 'development' ? 'Dev' : ''}
			</HeaderName>
			<HeaderNavigation aria-label='application menu' className={headerNavStyle}>
				<HeaderMenuItem
				className={headerName}
				onClick={() => navigate('/')}>
					Home
				</HeaderMenuItem>

				{/*         FILE MENU        */}
				<HeaderMenu
				aria-label='file'
				menuLinkName='File'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					onClick={() => setDisplayWizard(!displayWizard)}>
						<DocumentAdd size={16} /> New
					</HeaderMenuItem>
					{
						params?.id && fragment?.data &&
						<HeaderMenuItem
						className={headerName}
						onClick={
							() => saveBlob(
								new Blob([getFragmentJsonExportString(fragment, globalState.fragments, globalState.styleClasses)]),
								`${fragment.title}.json`
							)
						}>
							<Download size={16} /> Save as .json
						</HeaderMenuItem>
					}
					{
						params?.id && fragment?.data &&
						<HeaderMenuItem
						className={headerName}
						onClick={() => modalContext && modalContext.showFragmentExportModal(fragment)}>
							<DocumentExport size={16} /> Export
						</HeaderMenuItem>
					}
					<HeaderMenuItem
					className={headerName}
					onClick={() => {
						setDisplayWizard(!displayWizard);
						setDisplayedModal(FragmentWizardModals.IMPORT_JSON_MODAL);
					}}>
						<DocumentImport size={16} /> Open .json
					</HeaderMenuItem>
				</HeaderMenu>

				{/*         FEEDBACK MENU        */}
				<HeaderMenu
				aria-label='feedback'
				menuLinkName='Feedback'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					href='https://github.com/IBM/carbon-ui-builder/issues/new?labels=bug&template=bug_report.yml'
					target='_blank'>
						<Debug size={16} /> I found a bug
					</HeaderMenuItem>
				</HeaderMenu>

				{/*         HELP MENU        */}
				<HeaderMenu
				aria-label='help'
				menuLinkName='Help'
				className={headerName}>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/introduction')}>
						<Information size={16} /> Introduction
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					href='https://github.com/IBM/carbon-ui-builder/discussions/categories/frequently-asked-questions-faq'
					target='_blank'>
						<Help size={16} /> FAQ
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					onClick={() => navigate('/help/hotkeys')}>
						<Keyboard size={16} /> Hotkeys / Shortcuts
					</HeaderMenuItem>
					<HeaderMenuItem
					className={headerName}
					href='https://ibm-studios.slack.com/archives/C02LL3SMXFS'
					target='_blank'>
						<ChatLaunch size={16} /> I have a question
					</HeaderMenuItem>
					<div className={dividerStyle} />
					<HeaderMenuItem
					className={headerName}
					href='https://github.com/IBM/carbon-ui-builder'
					target='_blank'>
						<LogoGithub size={16} /> Fork on GitHub
					</HeaderMenuItem>
				</HeaderMenu>
			</HeaderNavigation>
			<HeaderGlobalBar>
				<HeaderGlobalAction
				aria-label='User profile'
				tooltipAlignment='end'
				onClick={() => setUserMenuVisible(!userMenuVisible)}>
					{
						user.profileImageUrl
						? <img className={profileImageStyle} src={user.profileImageUrl} />
						: <UserAvatar size={20} />
					}
				</HeaderGlobalAction>
			</HeaderGlobalBar>
			<HeaderPanel
			aria-label='User info'
			expanded={userMenuVisible}>
				<Switcher aria-label='User menu'>
					{
						user.isLoggedIn
						? <>
							<li className='cds--switcher__item' style={{ paddingLeft: '1rem' }}>Hi {user.name || user.githubLogin}!</li>
							<SwitcherItem
							className={switcherItemWithIconStyle}
							aria-label='all repositories'
							onClick={() => navigate('/repo')}>
								<FolderDetails size={16} /> All repositories
							</SwitcherItem>
							<div className={itemSeparatorStyle} />
							<SwitcherItem
							aria-label='log out'
							onClick={() => modalContext.showLogoutGithubModal()}>
								Log out
							</SwitcherItem>
						</>
						: <SwitcherItem
						aria-label='log in with github'
						onClick={() => modalContext.showLoginGithubModal()}>
							Log in with GitHub
						</SwitcherItem>
					}
					<SwitcherItem
					aria-label='custom components'
					onClick={() => modalContext.showCustomComponentsModal()}>
						Custom components
						<Tooltip align='bottom' label='Experimental functionality.'>
							<button type='button' className={css`border: none; background: inherit;`}>
								<Warning />
							</button>
						</Tooltip>
					</SwitcherItem>
				</Switcher>
			</HeaderPanel>
		</ShellHeader>
	);
};
