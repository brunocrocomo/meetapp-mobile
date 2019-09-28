import React, { useState, useEffect } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore, subDays, addDays } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '~/services/api';

import Background from '~/components/Background';
import Header from '~/components/Header';
import DateInput from '~/components/DateInput';
import MeetupCard from '~/components/MeetupCard';

import {
    Container,
    DatePicker,
    ChevronLeft,
    ChevronRight,
    ListContainer,
    MeetupList,
    EmptyListText,
    Spinner,
} from './styles';

function Dashboard({ isFocused }) {
    const [meetups, setMeetups] = useState([]);
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMeetups() {
            try {
                const response = await api.get('meetups', {
                    params: { date },
                });

                const data = response.data.map(meetup => ({
                    ...meetup,
                    past: isBefore(parseISO(meetup.date), new Date()),
                    date: format(
                        parseISO(meetup.date),
                        "dd 'de' MMMM',' 'às' HH'h'",
                        {
                            locale: pt,
                        }
                    ),
                }));

                setMeetups(data);
                setLoading(false);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os meetups.');
            }
        }

        if (isFocused) {
            loadMeetups();
        }
    }, [date, isFocused]);

    function handlePrevDay() {
        const prevDay = subDays(date, 1);
        const today = new Date();

        if (isBefore(prevDay, today)) {
            setDate(today);
        } else {
            setDate(prevDay);
        }
    }

    function handleNextDay() {
        setDate(addDays(date, 1));
    }

    async function loadMore() {
        const nextPage = page + 1;

        const response = await api.get('meetups', {
            params: { date, page: nextPage },
        });

        const data = response.data.map(meetup => ({
            ...meetup,
            past: isBefore(parseISO(meetup.date), new Date()),
            defaultDate: meetup.date,
            date: format(parseISO(meetup.date), "dd 'de' MMMM',' 'às' HH'h'", {
                locale: pt,
            }),
        }));

        setMeetups([...meetups, ...data]);
        setPage(nextPage);
    }

    async function handleSubscribe(id) {
        try {
            await api.post(`/meetups/${id}/subscriptions`);

            Alert.alert('Sucesso', 'Sua inscrição foi relizada!');
        } catch (err) {
            const { error } = err.response.data;
            Alert.alert('Erro', error);
        }
    }

    return (
        <Background>
            <Header />
            <Container>
                <DatePicker>
                    <TouchableOpacity onPress={handlePrevDay}>
                        <ChevronLeft
                            name="chevron-left"
                            size={30}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                    <DateInput date={date} onChange={setDate} />
                    <TouchableOpacity onPress={handleNextDay}>
                        <ChevronRight
                            name="chevron-right"
                            size={30}
                            color="#FFF"
                        />
                    </TouchableOpacity>
                </DatePicker>

                <ListContainer>
                    {loading && <Spinner />}

                    {!loading &&
                        (meetups.length ? (
                            <MeetupList
                                data={meetups}
                                keyExtractor={item => String(item.id)}
                                renderItem={({ item }) => (
                                    <MeetupCard
                                        data={item}
                                        buttonLabel="Realizar inscrição"
                                        onButtonPress={() =>
                                            handleSubscribe(item.id)
                                        }
                                    />
                                )}
                                onEndReachedThreshold={0.2}
                                onEndReached={loadMore}
                            />
                        ) : (
                            <EmptyListText>
                                Nenhum meetup marcado para esta data! :(
                            </EmptyListText>
                        ))}
                </ListContainer>
            </Container>
        </Background>
    );
}

Dashboard.propTypes = {
    isFocused: PropTypes.bool.isRequired,
};

Dashboard.navigationOptions = {
    tabBarLabel: 'Meetups',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="format-list-bulleted" size={20} color={tintColor} />
    ),
};

export default withNavigationFocus(Dashboard);
