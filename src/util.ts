export function toType(obj: any): string {
	return {}.toString
		.call(obj)
		.match(/\s([a-zA-Z]+)/)[1]
		.toLowerCase();
}

interface Data {
	[key: string]: any;
}

// 개체에서 키와 일치하는 항목을 반환합니다.
// 'dot-notation'를 다룰 수 있을 만큼 똑똑하다.
// 따라서 "a.b"는 obj["a.b"] 또는 obj["a"]["b"](있는 경우)를 반환합니다.
export function deepField(data: Data[] | Data, propertyPath: string[], propertySearch: boolean, propertySearchDepth: number) {
	let ret = null,
		i,
		copyPropertyPath,
		itemValue,
		parameter,
		newPropertySearchDepth = -1;
	// 속성 검색이 활성화되었을 때 최대 검색 깊이에 도달했는지 확인합니다.
	if (propertySearch === true) {
		if (propertySearchDepth === 0) {
			// 최대 깊이에 도달.
			return null;
		} else if (propertySearchDepth !== -1) {
			newPropertySearchDepth = propertySearchDepth - 1;
		}
	}

	if (data === null || data === undefined || propertyPath === null || propertyPath === undefined || !Array.isArray(propertyPath) || propertyPath.length < 1) {
		ret = null;
	} else if (Array.isArray(data)) {
		// 배열일 경우 모든 항목을 검사하여 값을 확인해야 합니다.
		// 각 항목을 살펴보고 해당 항목이 있는 모든 값을 반환합니다.
		ret = [];
		for (i = 0; i < data.length; i++) {
			// 첫 번째 라운드는 참조일 뿐이고
			// 두 번째 라운드는 더 이상 무엇을 찾아야 할지 모르기 때문에 값을 복사합니다.
			copyPropertyPath = propertyPath.slice(0);

			// 값 찾기 시도
			itemValue = deepField(data[i], copyPropertyPath, propertySearch, newPropertySearchDepth - 1);

			// 일치하는 모든 값을 반환합니다.
			if (itemValue !== null) {
				ret.push(itemValue);
			}
		}
		if (ret.length === 0) {
			ret = null;
		}
	} else if (typeof data === "object") {
		// 객체이므로 정상적으로 진행할 수 있습니다.

		// 매개변수 가져오기
		parameter = propertyPath[0];

		// PropertySearch가 활성화되면 더 낮은 레벨로 이동합니다.
		if (!data.hasOwnProperty(parameter) && propertySearch) {
			const propertyNames = Object.keys(data);
			ret = [];

			for (i = 0; i < propertyNames.length; i++) {
				const propertyData = data[propertyNames[i]];

				if (propertyData === null || propertyData === undefined) {
					continue;
				}

				// 속성에 배열 또는 개체가 포함된 경우 더 자세히 파야 합니다.
				if (Array.isArray(propertyData)) {
					// 배열이기 때문에 모든 품목을 확인해야 합니다.
					propertyData.forEach(function (propertyDataItem) {
						const foundValue = deepField(propertyDataItem, propertyPath, propertySearch, newPropertySearchDepth);
						if (foundValue !== null) {
							ret.push(foundValue);
						}
					});
				} else if (propertyData.constructor.name === "Object") {
					// 단일 객체이므로 직접 확인할 수 있습니다.
					const foundValue = deepField(propertyData, propertyPath, propertySearch, newPropertySearchDepth);
					if (foundValue !== null) {
						ret.push(foundValue);
					}
				}
			}

			if (ret.length === 0) {
				ret = null;
			} else if (ret.length === 1) {
				ret = ret[0];
			}
		} else if (propertyPath.length < 2) {
			// 현재 부품이 마지막 매개 변수 부분이었다면 직접 반환할 수 있습니다.
			ret = data[parameter];
		} else {
			// 부품이 더 남아 있으면 검색을 계속합니다.

			// 첫 번째 매개 변수를 제거합니다.
			ret = deepField(data[parameter], propertyPath.slice(1), propertySearch, newPropertySearchDepth);
		}
	}

	return ret;
}
