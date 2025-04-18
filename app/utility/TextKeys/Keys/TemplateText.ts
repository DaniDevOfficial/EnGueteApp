

// replace the REPLACEME with the actual name of the TextKeyGroup.
export type REPLACEMETextType =
    | 'test'
    ;

export type REPLACEMETextKeyType = {
    [K in REPLACEMETextType]: {
        german: string;
        english: string;
    };
};

export const REPLACEMETextKey: REPLACEMETextKeyType = {
    'test': {
        german: 'Test',
        english: 'Test',
    }
}