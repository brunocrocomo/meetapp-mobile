import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import { format, parseISO, isBefore, subDays, addDays } from 'date-fns';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    const [maxPageReached, setMaxPageReached] = useState(false);

    const load = useCallback(async (queryDate = new Date(), queryPage = 1) => {
        try {
            if (queryPage > 1) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await api.get('meetups', {
                params: { date: queryDate, page: queryPage },
            });

            if (response.data.length <= 0) {
                setMaxPageReached(true);
            }

            const data = response.data.map(meetup => ({
                ...meetup,
                past: isBefore(parseISO(meetup.date), new Date()),
                date: format(parseISO(meetup.date), 'MMMM do, h:mm a'),
            }));

            setMeetups(m => {
                if (queryPage > 1) {
                    return [...m, ...data];
                }

                return data;
            });

            setPage(queryPage);

            if (queryPage > 1) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            showErrorSnackbar(
                'An error ocurred while loading the meetup list.'
            );
        }
    }, []);

    function loadMore() {
        if (!loadingMore) {
            load(date, page + 1);
        }
    }

    useEffect(() => {
        if (isFocused) {
            setMaxPageReached(false);
            load(date, 1);
        }
    }, [load, date, isFocused]);

    function handlePrevDay() {
        if (loading || loadingMore) {
            return;
        }

        const prevDay = subDays(date, 1);
        const today = new Date();

        if (isBefore(prevDay, today)) {
            setDate(today);
        } else {
            setDate(prevDay);
        }
    }

    function handleNextDay() {
        if (loading || loadingMore) {
            return;
        }

        setDate(addDays(date, 1));
    }

    function handleDateInputOnChange(pickedDate) {
        if (loading || loadingMore) {
            return;
        }

        setDate(pickedDate);
    }

    async function handleSubscribe(id) {
        try {
            await api.post(`/meetups/${id}/subscriptions`);

            showSuccessSnackbar('You are now subscribed to a new meetup!');
        } catch (err) {
            let { error } = err.response.data;
            if (error.constructor !== String) {
                error =
                    'It was not possible to complete your request. Please, try again.';
            }
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
                                onEndReachedThreshold={
                                    maxPageReached ? null : 0.2
                                }
                                onEndReached={maxPageReached ? null : loadMore}
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

Dashboard.navigationOptions = {
    tabBarLabel: 'Meetups',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="format-list-bulleted" size={20} color={tintColor} />
    ),
};

Dashboard.propTypes = {
    isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Dashboard);
