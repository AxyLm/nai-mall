import * as storage from './funs/storage';
import * as copy from './funs/copy';
import * as types from './funs/types';
import { formatDate } from './funs/date';
export default {
	...storage,
	...copy,
	...types,
	formatDate
}