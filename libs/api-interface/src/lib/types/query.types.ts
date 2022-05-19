export interface QueryParameters {
    limit?: number;
    offset?: number;
    order?: OrderQueryParameter[];
    filter?: FilterQueryParameter[];
}

export interface OrderQueryParameter {
    field: string;
    direction: 'ASC' | 'DESC';
}

export interface FilterQueryParameter {
    field: string;
    op: '=' | '>' | '<' | '>=' | '<=' | '<>' | 'LIKE';
    value: string | number;
    joining?: 'AND' | 'OR';
}

export const ISearchModes = {
    LATEST: 'latest',
    SAVED: 'saved',
    SHUFFLE: 'shuffle',
    SEARCH_QUERY: 'query',
    PROFILE: 'profile',
};
