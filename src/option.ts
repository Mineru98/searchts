function _getSingleOpt(first, override, fallback: "AND" | boolean | number) {
	if (first !== undefined) {
		return first;
	} else if (override !== undefined) {
		return override;
	} else {
		return fallback;
	}
}

interface IOptions {
	negator: boolean;
	joinAnd: boolean;
	text: boolean;
	word: boolean;
	regexp: boolean;
	start: boolean;
	end: boolean;
	separator: boolean;
	propertySearch: boolean;
	propertySearchDepth: boolean;
}

export function _getOptions(search, _defaults) {
	const options: IOptions = {
		negator: false,
		joinAnd: false,
		text: false,
		word: false,
		regexp: false,
		start: false,
		end: false,
		separator: false,
		propertySearch: false,
		propertySearchDepth: false,
	};

	search = search || {};

	// did we have a negator?
	//options.negator = search._not ? true : _defaults.negator || false;
	options.negator = _getSingleOpt(search._not, _defaults.negator, false);
	// do we join via AND or OR
	//options.joinAnd = search._join && search._join === "OR" ? false : _defaults.join || true;
	options.joinAnd = _getSingleOpt(search._join, _defaults.join, "AND") !== "OR";

	// did we have text, word, regex, start or end search?
	options.text = _getSingleOpt(search._text, _defaults.text, false);
	options.word = _getSingleOpt(search._word, _defaults.word, false);
	options.regexp = _getSingleOpt(search._regexp, _defaults.regexp, false);
	options.start = _getSingleOpt(search._start, _defaults.start, false);
	options.end = _getSingleOpt(search._end, _defaults.end, false);

	options.separator = search._separator || _defaults.separator || ".";
	options.propertySearch = _getSingleOpt(search._propertySearch, _defaults.propertySearch, false);
	options.propertySearchDepth = _getSingleOpt(search._propertySearchDepth, _defaults.propertySearchDepth, -1);

	return options;
}
