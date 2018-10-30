import moment from 'moment';
import _ from 'lodash';

export default {
    getTripSummary: trip => {
        const desc = _.map(trip.stop, s => _.get(s, 'stopLocation.name'));
        return _.join(desc, ' > ');
    },
    getFormattedStringFromUTCDateTime: date => {
        if (date) {
            return moment(date)
                .format('MM/DD/YYYY HH:mm');
        }
        return '--:--';
    },
    getFormattedDateOnlyStringFromUTCDateTime: date => {
        if (date) {
            return moment(date)
                .format('MM/DD/YYYY');
        }
        return '--:--';
    },
    getFormattedTimeOnlyFromUTCDateTime: date => {
        if (!date) return '--:--';
        return moment(date)
            .format('HH:mm');
    },
    getJobBolBookingClientRef: trip => {
        const job = _.get(trip, 'container.job');
        return _.join(
            _.compact([
                _.get(job, 'name'),
                _.get(job, 'clientRefNo'),
                _.get(job, 'jobExportDetail.booking'),
                _.get(job, 'jobImportDetail.billOfLading'),
            ]),
            '/',
        );
    },
    getContainerTypeWeight: container => {
        return _.join(
            _.compact([
                _.get(container, 'type'),
                _.get(container, 'grossWeight'),
            ]),
            ' / ',
        );
    },
    getTimeGap: (trip, lastStop) => {
        if (_.get(trip, 'estimatedStartTime')) {
            const diff = moment(_.get(trip, 'estimatedStartTime'))
                .diff(moment(_.get(lastStop, 'plannedDateTime')));
            if (_.isNaN(diff)) {
                return '--';
            }
            return (diff / 3600000).toFixed(2);
        }
    },
    getDistanceGap: async (trip, lastStop, callback) => {
        const start = _.get(
            lastStop,
            'stopLocation.geoLocation.coordinates.coordinates',
        );
        const end = _.get(trip, 'startLocation.coordinates');
        if (start && end) {
            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route(
                {
                    origin: new google.maps.LatLng(start[0], start[1]),
                    destination: new google.maps.LatLng(end[0], end[1]),
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        callback(
                            trip,
                            _.get(result, 'routes[0].legs[0].distance.value'),
                        );
                    }
                },
            );
        }
    },
};
