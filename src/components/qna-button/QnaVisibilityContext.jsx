// QnaVisibilityContext.js
import React, { useState, createContext, useContext } from 'react';

const QnaVisibilityContext = createContext();

export const useQnaVisibility = () => useContext(QnaVisibilityContext);

export const QnaVisibilityProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <QnaVisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
            {children}
        </QnaVisibilityContext.Provider>
    );
};
