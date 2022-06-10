// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized-auto-sizer';
import {FixedSizeList} from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import {UserProfile} from '@mattermost/types/users';
import {Channel} from '@mattermost/types/channels';

import Member from './member';
import {ChannelMember} from './channel_members_rhs';

export interface Props {
    channel: Channel;
    members: ChannelMember[];
    editing: boolean;
    hasNextPage: boolean;
    isNextPageLoading: boolean;

    actions: {
        openDirectMessage: (user: UserProfile) => void;
        loadMore: () => void;
    };
}

const MemberList = ({
    hasNextPage,
    isNextPageLoading,
    channel,
    members,
    editing,
    actions,
}: Props) => {
    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const itemCount = hasNextPage ? members.length + 1 : members.length;

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreItems = isNextPageLoading ? () => {} : actions.loadMore;

    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = (index: number) => !hasNextPage || index < members.length;

    // Render an item or a loading indicator.
    const Item = ({index, style}: any) => {
        const member = members[index];

        if (isItemLoaded(index)) {
            return (
                <div style={style}>
                    <Member
                        key={member.user.id}
                        channel={channel}
                        index={index}
                        totalUsers={members.length}
                        member={member}
                        editing={editing}
                        actions={{openDirectMessage: actions.openDirectMessage}}
                    />
                </div>
            );
        }

        return null;
    };

    return (
        <AutoSizer>
            {({height, width}) => (
                <InfiniteLoader
                    isItemLoaded={isItemLoaded}
                    itemCount={itemCount}
                    loadMoreItems={loadMoreItems}
                >
                    {({onItemsRendered, ref}) => (
                        <FixedSizeList
                            itemCount={itemCount}
                            onItemsRendered={onItemsRendered}
                            ref={ref}
                            itemSize={48}
                            height={height}
                            width={width}
                        >
                            {Item}
                        </FixedSizeList>
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
};

export default MemberList;
