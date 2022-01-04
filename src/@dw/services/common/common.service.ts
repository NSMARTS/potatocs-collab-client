import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable({
	providedIn: 'root'
})
export class CommonService {

	dateFormatting(date: Date, mode?: string) {
		if (mode === 'fromNow') {
			return moment(date).fromNow();
		} else if (mode === 'dateTime') {
			return moment(date).format('YYYY-MM-DD HH:mm:ss');
		} else if (mode === 'dateOnly') {
			return moment(date).format('YYYY.MM.DD');
		} else if (mode === 'dateOnlyKor') {
			return moment(date).format('ll dddd');
		} else if (mode === 'timeOnly') {
			return moment(date).locale('en').format('hh:mm a');
		} else if (mode === 'chatDate') {
			return moment(date).format('YYYY-MM-DD HH:mm');
		}

		// default: full // 세네갈 시간은 utc+0
		return moment(date).format('YYYY-MM-DD');

	}

	checkArray(data, arrayData) {
		const isInArray = arrayData.includes(data._id);
		if (isInArray) {
			return data.isAdmin = true;
		} else {
			return data.isAdmin = false;
		}
	}

}