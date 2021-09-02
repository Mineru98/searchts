interface ICommon {
	negator: boolean;
	text: boolean;
	word: boolean;
	regexp: boolean;
	start: boolean;
	end: boolean;
	separator: string;
	propertySearch: boolean;
	propertySearchDepth: number;
}

export interface IData {
	[key: string]: any;
}
export interface IOptions extends ICommon {
	joinAnd: boolean;
}

export interface IDefault extends ICommon {
	join: "AND" | "OR";
}

export interface ISearchOps extends IData {
	terms?: IData[];
	_not?: boolean;
	_join?: "AND" | "OR";
	_text?: boolean;
	_word?: boolean;
	_regexp?: boolean;
	_start?: boolean;
	_end?: boolean;
	_separator?: string;
	_propertySearch?: boolean;
	_propertySearchDepth?: number;
}

function _getSingleOpt<T, R>(first: T, override: T, fallback: R): T | R {
	if (first !== undefined) {
		return first;
	} else if (override !== undefined) {
		return override;
	} else {
		return fallback;
	}
}

export function _getOptions(search: ISearchOps = {} as ISearchOps, _defaults: IDefault): IOptions {
	const options: IOptions = {} as IOptions;

	// 부정문이 있나요?
	//options.negator = search._not ? true : _defaults.negator || false;
	options.negator = _getSingleOpt<boolean, boolean>(search._not, _defaults.negator, false);
	// join에 AND 또는 OR이 있나요?
	//options.joinAnd = search._join && search._join === "OR" ? false : _defaults.join || true;
	options.joinAnd = _getSingleOpt<string, string>(search._join, _defaults.join, "AND") !== "OR";

	// 문자, 단어, 정규식, 시작 또는 끝 검색 중 어떤 것이 있습니까?
	options.text = _getSingleOpt<boolean, boolean>(search._text, _defaults.text, false);
	options.word = _getSingleOpt<boolean, boolean>(search._word, _defaults.word, false);
	options.regexp = _getSingleOpt<boolean, boolean>(search._regexp, _defaults.regexp, false);
	options.start = _getSingleOpt<boolean, boolean>(search._start, _defaults.start, false);
	options.end = _getSingleOpt<boolean, boolean>(search._end, _defaults.end, false);

	// (.) 구분 기호
	options.separator = search._separator || _defaults.separator || ".";
	options.propertySearch = _getSingleOpt(search._propertySearch, _defaults.propertySearch, false);
	options.propertySearchDepth = _getSingleOpt<number, number>(search._propertySearchDepth, _defaults.propertySearchDepth, -1);

	return options;
}
