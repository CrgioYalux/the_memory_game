import { useState, useEffect } from 'react';
import axios from 'axios';

interface useFetchProps {
	url: string;
	showLogs?: boolean;
}

interface useFetchReturns<T> {
	data: T[];
	loading: boolean;
	error: boolean;
}

enum FetchState {
	Loading,
	Ready,
	Error,
}

export function useFetch<T>({
	url,
	showLogs,
}: useFetchProps): useFetchReturns<T> {
	const [fetchResult, setFetchResult] = useState<Array<T>>([]);
	const [fetchState, setFetchState] = useState<FetchState>(FetchState.Loading);

	const error = fetchState === FetchState.Error;
	const loading = fetchState === FetchState.Loading;

	useEffect(() => {
		axios
			.get<Array<T>>(url)
			.then((response) => {
				setFetchResult(response.data);
				setFetchState(FetchState.Ready);
			})
			.catch((error) => {
				setFetchResult([]);
				setFetchState(FetchState.Error);
				if (showLogs) {
					console.error(error);
				}
			});
	}, []);

	return { data: fetchResult, loading, error };
}
