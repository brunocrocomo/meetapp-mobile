import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore, subDays, addDays } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '~/services/api';

import { showSuccessSnackbar, showErrorSnackbar } from '../../utils/Snackbar';

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
    Spinner,
    InfiniteLoaderSpinner,
    EmptyListContainer,
    EmptyListIcon,
    EmptyListText,
} from './styles';

function Dashboard({ isFocused }) {
    const [meetups, setMeetups] = useState([]);
    const [date, setDate] = useState(new Date());
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        async function loadMeetups() {
            try {
                setMeetups([]);
                setLoading(true);
                setPage(1);

                const response = await api.get('meetups', {
                    params: { date },
                });

                if (response.data.length) {
                    const data = response.data.map(meetup => ({
                        ...meetup,
                        past: isBefore(parseISO(meetup.date), new Date()),
                        date: format(parseISO(meetup.date), 'MMMM do, h:mm a'),
                    }));

                    setMeetups(data);
                }

                setLoading(false);
            } catch (error) {
                showErrorSnackbar(
                    'An error ocurred while loading the meetup list.'
                );
            }
        }

        if (isFocused) {
            loadMeetups();
        }
    }, [date, isFocused]);

    function handlePrevDay() {
        if (!loading && !loadingMore) {
            const prevDay = subDays(date, 1);
            const today = new Date();

            if (isBefore(prevDay, today)) {
                setDate(today);
            } else {
                setDate(prevDay);
            }
        }
    }

    function handleNextDay() {
        if (!loading && !loadingMore) {
            setDate(addDays(date, 1));
        }
    }

    function handleDateInputOnChange(pickedDate) {
        if (!loading && !loadingMore) {
            setDate(pickedDate);
        }
    }

    async function loadMore() {
        setLoadingMore(true);

        const nextPage = page + 1;

        const response = await api.get('meetups', {
            params: { date, page: nextPage },
        });

        if (response.data.length) {
            const data = response.data.map(meetup => ({
                ...meetup,
                past: isBefore(parseISO(meetup.date), new Date()),
                defaultDate: meetup.date,
                date: format(parseISO(meetup.date), 'MMMM do, h:mm a'),
            }));

            setMeetups([...meetups, ...data]);
            setPage(nextPage);
        }

        setLoadingMore(false);
    }

    async function handleSubscribe(id) {
        try {
            await api.post(`/meetups/${id}/subscriptions`);

            showSuccessSnackbar('You are now subscribed to a new meetup!');
        } catch (err) {
            const { error } = err.response.data;
            showErrorSnackbar(error);
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
                    <DateInput date={date} onChange={handleDateInputOnChange} />
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
                                        buttonLabel="Subscribe"
                                        onButtonPress={() =>
                                            handleSubscribe(item.id)
                                        }
                                    />
                                )}
                                ListFooterComponent={
                                    loadingMore && <InfiniteLoaderSpinner />
                                }
                                onEndReachedThreshold={0.2}
                                onEndReached={loadMore}
                            />
                        ) : (
                            <EmptyListContainer>
                                <EmptyListIcon />
                                <EmptyListText>No meetups found!</EmptyListText>
                            </EmptyListContainer>
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
