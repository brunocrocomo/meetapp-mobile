import React, { useMemo } from 'react';
import { DatePickerAndroid, View, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';

import { DateText } from './styles';

export default function DateInput({ date, onChange }) {
    const dateFormatted = useMemo(
        () => format(date, "dd 'de' MMMM", { locale: pt }),
        [date]
    );

    async function handleOpenPicker() {
        const { action, year, month, day } = await DatePickerAndroid.open({
            mode: 'spinner',
            minDate: new Date(),
            date,
        });

        if (action === DatePickerAndroid.dateSetAction) {
            const selectedDate = new Date(year, month, day);

            onChange(selectedDate);
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={handleOpenPicker}>
                <DateText>{dateFormatted}</DateText>
            </TouchableOpacity>
        </View>
    );
}

DateInput.propTypes = {
    date: PropTypes.objectOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
};
