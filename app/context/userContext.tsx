import React, { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
    userName: string;
    userId: string;
    profilePicture: string;
};

type UserContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

type UserProviderProps = {
    children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps): JSX.Element {
    const [user, setUser] = useState<User>({
        userName: '',
        userId: '',
        profilePicture: '',
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
