import React, { createContext, useContext, useState } from 'react';

const PROGRAMS = [
    { slug: 'elite_2026', label: 'Elite Program 2026', active: true },
    // Future programs get added here:
    // { slug: 'winter_camp_2026', label: 'Winter Camp 2026', active: true },
    // { slug: 'elite_2027', label: 'Elite Program 2027', active: false },
];

const ProgramContext = createContext({
    selectedProgram: 'elite_2026',
    setSelectedProgram: () => {},
    programs: PROGRAMS,
    programLabel: 'Elite Program 2026',
});

export const ProgramProvider = ({ children }) => {
    const [selectedProgram, setSelectedProgram] = useState('elite_2026');

    const programLabel = PROGRAMS.find(p => p.slug === selectedProgram)?.label || selectedProgram;

    return (
        <ProgramContext.Provider value={{ selectedProgram, setSelectedProgram, programs: PROGRAMS, programLabel }}>
            {children}
        </ProgramContext.Provider>
    );
};

export const useProgram = () => useContext(ProgramContext);

export default ProgramContext;
