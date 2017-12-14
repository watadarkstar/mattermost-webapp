// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {getSiteURL} from 'utils/url';

import ChangeURLModal from './change_url_modal';

function mapStateToProps(state, ownProps) {
    const currentTeam = getCurrentTeam(state);
    const currentTeamURL = `${getSiteURL()}/${currentTeam.name}`;
    return {
        ...ownProps,
        currentTeamURL
    };
}

export default connect(mapStateToProps)(ChangeURLModal);
