import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore } from 'date-fns';
import pt from 'date-fns/locale/pt';
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
                    subscriptionId: meetup.id,
                    ...meetup.Meetup,
                    past: isBefore(parseISO(meetup.Meetup.date), new Date()),
                    date: format(
                        parseISO(meetup.Meetup.date),
                        "dd 'de' MMMM',' 'às' HH'h'",
                        {
                            locale: pt,
                        }
                    ),
                }));

                setSubscriptions(data);
                setLoading(false);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os meetups.');
            }
        }

        if (isFocused) {
            loadMeetups();
        }
    }, [isFocused]);

    async function handleUnsubscribe(meetup) {
        try {
            const { subscriptionId } = meetup;
            const { id } = meetup;

            await api.delete(`/subscriptions/${subscriptionId}`);

            setSubscriptions(subscriptions.filter(item => item.id !== id));

            Alert.alert(
                'Sucesso',
                'Cancelamento da inscrição realizado com sucesso!'
            );
        } catch (error) {
            Alert.alert(
                'Erro',
                'Não foi possível cancelar sua inscrição no meetup.'
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
                                    buttonLabel="Cancelar inscrição"
                                    onButtonPress={() =>
                                        handleUnsubscribe(item)
                                    }
                                />
                            )}
                        />
                    ) : (
                        <EmptyListText>
                            Você não se inscreveu em nenhum meetup ainda! :(
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
    tabBarLabel: 'Inscrições',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="local-offer" size={20} color={tintColor} />
    ),
};

export default withNavigationFocus(Subscription);
