import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '~/services/api';

import Background from '~/components/Background';
import Header from '~/components/Header';
import MeetupCard from '~/components/MeetupCard';

import { Container, EmptyListText, SubscriptionList, Spinner } from './styles';

function Subscription({ isFocused }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMeetups() {
            try {
                const response = await api.get('subscriptions');

                const data = response.data.map(meetup => ({
                    ...meetup.Meetup,
                    past: isBefore(parseISO(meetup.Meetup.date), new Date()),
                    date: format(
                        parseISO(meetup.Meetup.date),
                        'MMMM do, h:mm a'
                    ),
                }));

                setSubscriptions(data);
                setLoading(false);
            } catch (error) {
                Alert.alert(
                    'Error',
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

            Alert.alert('Done!', 'You unsubscribed from the meetup!');
        } catch (error) {
            Alert.alert(
                'Error',
                'It was not possible to unsubscribe from this meetup.'
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
                        <EmptyListText>
                            You have not subscribed for any meetup yet! :(
                        </EmptyListText>
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
