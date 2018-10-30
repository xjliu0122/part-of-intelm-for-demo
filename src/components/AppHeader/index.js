import React, { PropTypes, Component } from 'react';
import { browserHistory, Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import { TabsContainer, Tabs, Tab } from 'react-md';
import getTabs from './tabConfig';

import {
    Avatar,
    FontIcon,
    AccessibleFakeButton,
    IconSeparator,
    DropdownMenu,
} from 'react-md';

//Styles
import './styles.scss';

//Constants
// import routeMap from 'constants/routeMap';
// import localStorageHelper from 'constants/localStorage';
// //Component
// import MenuRight from 'components/appHeader/right-menu';

// import ImageFallback from 'constants/imageFallback';
// import LoginEntity from 'entities/user/profile/action';

class AppHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [],
            activeTabIndex: 0,
        };
        this.changeActiveTab = this.changeActiveTab.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let tabs = this.state.tabs;
        if (
            this.state.tabs.length === 0 ||
            this.props.userProfile.role !== nextProps.userProfile.role
        ) {
            const role = nextProps.userProfile.role;
            tabs = getTabs(role);
            this.setState({
                tabs,
            });
        }

        this.configureNavigation(tabs, nextProps.location.pathname);
    }
    configureNavigation(userTabs, pathname) {
        const that = this;
        if (pathname === '/') {
            if (userTabs.length > 0) browserHistory.push(userTabs[0].route);
        } else {
            userTabs.forEach((tab, index) => {
                if (pathname.indexOf(tab.route) !== -1) {
                    that.changeActiveTab(index);
                }
            });
        }
    }

    changeRoute(route) {
        if (route) {
            // this.setContextMenuOpen(false);
            // this.setState({
            //     selectedContext: null,
            //     tabs: {},
            // });
            browserHistory.push(route);
        }
    }
    changeActiveTab(newTabIndex) {
        this.setState({
            activeTabIndex: newTabIndex,
        });
    }
    //
    logout() {
        browserHistory.push('/logout');
    }
    showSetting() {
        browserHistory.push('/setting');
    }
    render() {
        const { changeActiveTab } = this,
            { userProfile } = this.props,
            { activeTabIndex, tabs } = this.state;

        return (
            <div className="app-top">
                <img className="header-img" src="/logo.png" alt="/logo.png" />
                <TabsContainer
                    className="tabContainer"
                    activeTabIndex={activeTabIndex}
                    onTabChange={changeActiveTab}
                >
                    <Tabs tabId="headerNavTab">
                        {_.map(tabs, (item, index) => {
                            return item.label ? (
                                <Tab
                                    tabIndex={index}
                                    key={item.label}
                                    label={item.label}
                                    className="tabClass"
                                    onClick={() => this.changeRoute(item.route)}
                                />
                            ) : (
                                ''
                            );
                        })}
                    </Tabs>
                </TabsContainer>
                <div className="logout-menu">
                    <DropdownMenu
                        listClassName="header-avatar-dropdown-list"
                        menuItems={[
                            {
                                primaryText: 'Setting',
                                onClick: this.showSetting,
                            },
                            { divider: true },
                            {
                                primaryText: 'Log out',
                                onClick: this.logout,
                            },
                        ]}
                        anchor={{
                            x: DropdownMenu.HorizontalAnchors.INNER_LEFT,
                            y: DropdownMenu.VerticalAnchors.BOTTOM,
                        }}
                        position={DropdownMenu.Positions.TOP_LEFT}
                        animationPosition="below"
                        sameWidth
                    >
                        <AccessibleFakeButton
                            component={IconSeparator}
                            iconBefore
                            label={
                                <IconSeparator label={userProfile.name}>
                                    <FontIcon>arrow_drop_down</FontIcon>
                                </IconSeparator>
                            }
                        >
                            {userProfile.name && (
                                <Avatar suffix="grey">
                                    {userProfile.name[0]}
                                </Avatar>
                            )}
                        </AccessibleFakeButton>
                    </DropdownMenu>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        userProfile: state.userProfileReducer.profile,
    };
};
export default connect(mapStateToProps, {})(AppHeader);
