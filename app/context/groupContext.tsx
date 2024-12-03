import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Group = {
    groupId: string;
    userRoleRights: string[];
};

type GroupContextType = {
    group: Group;
    setGroup: React.Dispatch<React.SetStateAction<Group>>;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function useGroup(): GroupContextType {
    const context = useContext(GroupContext);
    if (!context) {
        throw new Error('useGroup must be used within a UserProvider');
    }
    return context;
}

type GroupProviderProps = {
    children: ReactNode;
};

export function GroupProvider({ children }: GroupProviderProps): JSX.Element {
    const [group, setGroup] = useState<Group>({
        groupId: '',
        userRoleRights: [],
    });

    return (
        <GroupContext.Provider value={{ group: group, setGroup: setGroup }}>
            {children}
        </GroupContext.Provider>
    );
}
