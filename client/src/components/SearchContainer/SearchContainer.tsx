import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { contentLanguages } from '../../utils/language';
import { selectLanguageFromState } from '../../store/language/selectors';
import { BootstrapInput } from '../../config/theme';
import Select from '@material-ui/core/Select';
import { yellow } from '@material-ui/core/colors';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { fr, it } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import { getSchedules } from '../../store/schedules/actions';
import { SearchCriteria } from '../../api/interfaces';
import { selectSchedulesFromState } from '../../store/schedules/selectors';

const geohash = {
    QUEBEC: 'f2m673',
    MONTREAL: 'f25dvk',
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#d7ebfc',
    },
    search: {
        margin: theme.spacing(1),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: theme.spacing(1),
    },
    adultsNumberContainer: {
        marginTop: 15,
    },
    searchContainer: {
        marginTop: 15,
    },
}));

const SearchButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500],
        '&:hover': {
            backgroundColor: yellow[600],
        },
        fontWeight: 'bold',
        fontFamily: [
            'Nunito',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
}))(Button);

const LoadingSpinner = withStyles((theme: Theme) => ({
    root: {
        marginRight: 10,
        opacity: 0.7,
    },
}))(CircularProgress);

const searchContainer = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { language } = useSelector(selectLanguageFromState);
    const { loading } = useSelector(selectSchedulesFromState);
    const [origin, setOrigin] = React.useState(geohash.QUEBEC);
    const [destination, setDestination] = React.useState(geohash.MONTREAL);
    const [departureDate, setDepartureDate] = React.useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
    const [adultsNumber, setAdultNumbers] = React.useState(1);
    contentLanguages.setLanguage(language);

    const handleOriginChange = (event: any) => {
        setOrigin(event.target.value);
    };

    const handleDestinationChange = (event: any) => {
        setDestination(event.target.value);
    };

    const handleDepartureDateChange = (event: any) => {
        setDepartureDate(event);
        setIsCalendarOpen(false);
    };

    const handleAdultNumberChange = (event: any) => {
        setAdultNumbers(event.target.value);
    };

    const handleSearchClick = () => {
        const formattedDate = departureDate.toISOString()?.split('T')[0];
        const search: SearchCriteria = {
            origin,
            destination,
            outbound_date: formattedDate,
            adult: adultsNumber,
            lang: language,
            index: 0,
        };
        dispatch(getSchedules.request(search));
    };

    return (
        <>
            <div className={classes.root}>
                <Grid container justify="space-around">
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.container}>
                            <InputLabel id="departure-select-label">
                                {contentLanguages.departureFrom}
                            </InputLabel>
                            <Select
                                labelId="departure-label"
                                id="departure-select"
                                value={origin}
                                onChange={handleOriginChange}
                                input={<BootstrapInput />}
                            >
                                <MenuItem value={geohash.QUEBEC}>
                                    {contentLanguages.quebec}
                                </MenuItem>
                                <MenuItem value={geohash.MONTREAL}>
                                    {contentLanguages.montreal}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.container}>
                            <InputLabel id="destination-select-label">
                                {contentLanguages.destination}
                            </InputLabel>
                            <Select
                                labelId="destination-label"
                                id="destination-select"
                                value={destination}
                                onChange={handleDestinationChange}
                                input={<BootstrapInput />}
                            >
                                <MenuItem value={geohash.QUEBEC}>
                                    {contentLanguages.quebec}
                                </MenuItem>
                                <MenuItem value={geohash.MONTREAL}>
                                    {contentLanguages.montreal}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.container}>
                            <MuiPickersUtilsProvider
                                utils={DateFnsUtils}
                                locale={
                                    language === 'fr'
                                        ? fr
                                        : language === 'it'
                                        ? it
                                        : ''
                                }
                            >
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="yyyy/MM/dd"
                                    margin="normal"
                                    id="departure-date-picker-inline"
                                    label={contentLanguages.departureDate}
                                    value={departureDate}
                                    minDate={new Date()}
                                    onChange={handleDepartureDateChange}
                                    inputVariant="outlined"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                        onFocus: (e) => {
                                            setIsCalendarOpen(true);
                                        },
                                    }}
                                    PopoverProps={{
                                        disableRestoreFocus: true,
                                        onClose: () => {
                                            setIsCalendarOpen(false);
                                        },
                                    }}
                                    InputProps={{
                                        onFocus: () => {
                                            setIsCalendarOpen(true);
                                        },
                                    }}
                                    open={isCalendarOpen}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={1}
                        className={classes.adultsNumberContainer}
                    >
                        <FormControl className={classes.container}>
                            <TextField
                                id="adult-number"
                                label={contentLanguages.adults}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                    },
                                }}
                                onChange={handleAdultNumberChange}
                                variant="outlined"
                                defaultValue={adultsNumber}
                            />
                        </FormControl>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        className={classes.searchContainer}
                    >
                        <FormControl className={classes.container}>
                            <SearchButton
                                variant="contained"
                                color="primary"
                                className={classes.search}
                                onClick={handleSearchClick}
                            >
                                {' '}
                                {loading ? (
                                    <LoadingSpinner size={24} color="inherit" />
                                ) : (
                                    ''
                                )}
                                {contentLanguages.search}
                            </SearchButton>
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default searchContainer;
