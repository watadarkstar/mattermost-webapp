// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {FormattedMessage} from 'react-intl';

import QuickInput from 'components/quick_input';
import UserList from 'components/user_list.jsx';
import * as Utils from 'utils/utils.jsx';

const NEXT_BUTTON_TIMEOUT = 500;

export default class SearchableItemList extends React.Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        itemsPerPage: PropTypes.number,
        listComponent: PropTypes.element,
        total: PropTypes.number,
        extraInfo: PropTypes.object,
        nextPage: PropTypes.func.isRequired,
        previousPage: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired,
        actions: PropTypes.arrayOf(PropTypes.func),
        actionProps: PropTypes.object,
        actionUserProps: PropTypes.object,
        focusOnMount: PropTypes.bool,
        renderCount: PropTypes.func,
        renderFilterRow: PropTypes.func,

        page: PropTypes.number.isRequired,
        term: PropTypes.string.isRequired,
        onTermChange: PropTypes.func.isRequired,

        // the type of user list row to render
        rowComponentType: PropTypes.func
    };

    static defaultProps = {
        items: [],
        itemsPerPage: 50, // eslint-disable-line no-magic-numbers
        listComponent: UserList,
        extraInfo: {},
        actions: [],
        actionProps: {},
        actionUserProps: {},
        showTeamToggle: false,
        focusOnMount: false
    };

    constructor(props) {
        super(props);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.focusSearchBar = this.focusSearchBar.bind(this);

        this.handleInput = this.handleInput.bind(this);

        this.renderCount = this.renderCount.bind(this);

        this.nextTimeoutId = 0;

        this.state = {
            nextDisabled: false
        };
    }

    componentDidMount() {
        this.focusSearchBar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.page !== prevProps.page || this.props.term !== prevProps.term) {
            this.refs.itemList.scrollToTop();
        }

        this.focusSearchBar();
    }

    componentWillUnmount() {
        clearTimeout(this.nextTimeoutId);
    }

    nextPage(e) {
        e.preventDefault();

        this.setState({nextDisabled: true});
        this.nextTimeoutId = setTimeout(() => this.setState({nextDisabled: false}), NEXT_BUTTON_TIMEOUT);

        this.props.nextPage();
        $(ReactDOM.findDOMNode(this.refs.channelListScroll)).scrollTop(0);
    }

    previousPage(e) {
        e.preventDefault();

        this.props.previousPage();
        $(ReactDOM.findDOMNode(this.refs.channelListScroll)).scrollTop(0);
    }

    focusSearchBar() {
        if (this.props.focusOnMount) {
            this.refs.filter.focus();
        }
    }

    handleInput(e) {
        this.props.onTermChange(e.target.value);
        this.props.search(e.target.value);
    }

    renderCount(items) {
        if (!items) {
            return null;
        }

        const count = items.length;
        const total = this.props.total;
        const isSearch = Boolean(this.props.term);

        let startCount;
        let endCount;
        if (isSearch) {
            startCount = -1;
            endCount = -1;
        } else {
            startCount = this.props.page * this.props.itemsPerPage;
            endCount = Math.min(startCount + this.props.itemsPerPage, total);
        }

        if (this.props.renderCount) {
            return this.props.renderCount(count, this.props.total, startCount, endCount, isSearch);
        }

        if (this.props.total) {
            if (isSearch) {
                return (
                    <FormattedMessage
                        id='filtered_user_list.countTotal'
                        defaultMessage='{count, number} {count, plural, one {member} other {members}} of {total, number} total'
                        values={{
                            count,
                            total
                        }}
                    />
                );
            }

            return (
                <FormattedMessage
                    id='filtered_user_list.countTotalPage'
                    defaultMessage='{startCount, number} - {endCount, number} {count, plural, one {member} other {members}} of {total, number} total'
                    values={{
                        count,
                        startCount: startCount + 1,
                        endCount,
                        total
                    }}
                />
            );
        }

        return null;
    }

    render() {
        const List = this.props.listComponent;
        let nextButton;
        let previousButton;
        let itemsToDisplay;

        if (this.props.term || !this.props.items) {
            itemsToDisplay = this.props.items;
        } else if (!this.props.term) {
            const pageStart = this.props.page * this.props.itemsPerPage;
            const pageEnd = pageStart + this.props.itemsPerPage;
            itemsToDisplay = this.props.items.slice(pageStart, pageEnd);

<<<<<<< HEAD:components/searchable_user_list/searchable_user_list.jsx
            if (pageEnd < this.props.users.length) {
=======
            if (itemsToDisplay.length >= this.props.itemsPerPage) {
>>>>>>> Gerneralize SearchableUserList for better re-use:components/searchable_item_list/searchable_item_list.jsx
                nextButton = (
                    <button
                        className='btn btn-default filter-control filter-control__next'
                        onClick={this.nextPage}
                        disabled={this.state.nextDisabled}
                    >
                        <FormattedMessage
                            id='filtered_user_list.next'
                            defaultMessage='Next'
                        />
                    </button>
                );
            }

            if (this.props.page > 0) {
                previousButton = (
                    <button
                        className='btn btn-default filter-control filter-control__prev'
                        onClick={this.previousPage}
                    >
                        <FormattedMessage
                            id='filtered_user_list.prev'
                            defaultMessage='Previous'
                        />
                    </button>
                );
            }
        }

        let filterRow;
        if (this.props.renderFilterRow) {
            filterRow = this.props.renderFilterRow(this.handleInput);
        } else {
            filterRow = (
                <div className='col-xs-12'>
                    <QuickInput
                        ref='filter'
                        className='form-control filter-textbox'
                        placeholder={Utils.localizeMessage('filtered_user_list.search', 'Search users')}
                        value={this.props.term}
                        onInput={this.handleInput}
                    />
                </div>
            );
        }

        return (
            <div className='filtered-user-list'>
                <div className='filter-row'>
                    {filterRow}
                    <div className='col-sm-12'>
                        <span className='member-count pull-left'>{this.renderCount(itemsToDisplay)}</span>
                    </div>
                </div>
                <div
                    className='more-modal__list'
                >
                    <List
                        ref='itemList'
                        users={itemsToDisplay}
                        extraInfo={this.props.extraInfo}
                        actions={this.props.actions}
                        actionProps={this.props.actionProps}
                        actionUserProps={this.props.actionUserProps}
                        rowComponentType={this.props.rowComponentType}
                    />
                </div>
                <div className='filter-controls'>
                    {previousButton}
                    {nextButton}
                </div>
            </div>
        );
    }
}