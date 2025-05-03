import React, {createContext, ReactNode, useContext, useState} from 'react';

export type Group = {
    groupId: string;
    groupName: string;
    userRoleRights: string[];
    filterDate: Date;
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
        groupName: '',
        userRoleRights: [],
        filterDate: new Date(),
    });

    return (
        <GroupContext.Provider value={{ group: group, setGroup: setGroup }}>
            {children}
        </GroupContext.Provider>
    );
}
