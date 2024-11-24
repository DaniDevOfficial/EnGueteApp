import React, {createContext, useContext, useState} from 'react';

// @ts-ignore
const UserContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({children}: any) {
    const [user, setUser] = useState({
        userName: '',
        userId: '',
        profilePicture: '',
    });

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}
