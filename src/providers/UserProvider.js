import React, { createContext, useState } from 'react'

export const UserContext = createContext(null);


export const UserProvider = (props) => {

    const [currentUser, setCurrentUser] = useState(null);

    console.log(currentUser)

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {props.children}
        </UserContext.Provider>
    )
}
