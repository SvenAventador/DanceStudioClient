import {create} from 'zustand'

const useTrainer = create((set) => ({
    selectedTrainer: null,
    setSelectedTrainer: (trainer) => set({selectedTrainer: trainer}),
    clearSelectedTrainer: () => set({selectedTrainer: null})
}))

export default useTrainer