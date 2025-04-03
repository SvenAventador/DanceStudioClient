import {create} from 'zustand'

const useSpecialization = create((set) => ({
    selectedSpecialization: null,
    setSelectedSpecialization: (specialization) => set({selectedSpecialization: specialization}),
    clearSelectedSpecialization: () => set({selectedSpecialization: null})
}))

export default useSpecialization