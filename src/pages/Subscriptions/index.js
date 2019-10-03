import React, { useState, useEffect } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '~/services/api';

import { showSuccessSnackbar, showErrorSnackbar } from '../../utils/Snackbar';

import Background from '~/components/Background';
import Header from '~/components/Header';
import MeetupCard from '~/components/MeetupCard';

import {
    Container,
    SubscriptionList,
    Spinner,
    EmptyListContainer,
    EmptyListIcon,
    EmptyListText,
} from './styles';

function Subscription({ isFocused }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMeetups() {
            try {
                const response = await api.get('subscriptions');

                if (response.data.length) {
                    const data = response.data.map(meetup => ({
                        ...meetup.Meetup,
                        past: isBefore(
                            parseISO(meetup.Meetup.date),
                            new Date()
                        ),
                        date: format(
                            parseISO(meetup.Meetup.date),
                            'MMMM do, h:mm a'
                        ),
                    }));

                    setSubscriptions(data);
                }

                setLoading(false);
            } catch (error) {
                showErrorSnackbar(
                    'An error ocurred while loading your subscription list.'
                );
            }
        }

        if (isFocused) {
            loadMeetups();
        }
    }, [isFocused]);

    async function handleUnsubscribe(meetup) {
        try {
            const { id } = meetup;

            await api.delete(`meetups/${id}/subscriptions`);

            setSubscriptions(subscriptions.filter(item => item.id !== id));

            showSuccessSnackbar('You unsubscribed from the meetup!');
        } catch (error) {
            showErrorSnackbar(
                'It was not possible to unsubscribe from the meetup.'
            );
        }
    }

    return (
        <Background>
            <Header />
            <Container>
                {loading && <Spinner />}
                {!loading &&
                    (subscriptions.length ? (
                        <SubscriptionList
                            data={subscriptions}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <MeetupCard
                                    data={item}
                                    buttonLabel="Cancel subscription"
                                    onButtonPress={() =>
                                        handleUnsubscribe(item)
                                    }
                                />
                            )}
                        />
                    ) : (
                        <EmptyListContainer>
                            <EmptyListIcon />
                            <EmptyListText>
                                Your subscriptions are shown here!
                            </EmptyListText>
                        </EmptyListContainer>
                    ))}
            </Container>
        </Background>
    );
}

Subscription.propTypes = {
    isFocused: PropTypes.bool.isRequired,
};

Subscription.navigationOptions = {
    tabBarLabel: 'Subscriptions',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="local-offer" size={20} color={tintColor} />
    ),
};

export default withNavigationFocus(Subscription);
